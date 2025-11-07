'''
Business: API для управления товарами, пользователями и заказами в игровом магазине
Args: event с httpMethod, body, queryStringParameters; context с request_id
Returns: HTTP response с данными или ошибкой
'''

import json
import os
import psycopg2
import psycopg2.extras
from typing import Dict, Any
import hashlib
import secrets

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def generate_referral_code(telegram_id: int) -> str:
    hash_obj = hashlib.sha256(f"{telegram_id}{secrets.token_hex(8)}".encode())
    return hash_obj.hexdigest()[:8].upper()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    path = event.get('queryStringParameters', {}).get('action', '')
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        if method == 'GET':
            if path == 'products':
                category = event.get('queryStringParameters', {}).get('category')
                if category and category != 'all':
                    cur.execute(
                        "SELECT * FROM products WHERE category = %s AND in_stock = true ORDER BY created_at DESC",
                        (category,)
                    )
                else:
                    cur.execute("SELECT * FROM products WHERE in_stock = true ORDER BY created_at DESC")
                
                products = cur.fetchall()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'products': products}, default=str),
                    'isBase64Encoded': False
                }
            
            elif path == 'user':
                user_id = event.get('headers', {}).get('X-User-Id')
                if not user_id:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Unauthorized'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'User not found'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "SELECT COUNT(*) as count FROM users WHERE referred_by_id = %s",
                    (user_id,)
                )
                referrals = cur.fetchone()
                
                cur.execute(
                    "SELECT o.*, COUNT(oi.id) as items_count FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id WHERE o.user_id = %s GROUP BY o.id ORDER BY o.created_at DESC",
                    (user_id,)
                )
                orders = cur.fetchall()
                
                cur.execute(
                    "SELECT * FROM notifications WHERE user_id = %s ORDER BY created_at DESC LIMIT 20",
                    (user_id,)
                )
                notifications = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'user': dict(user),
                        'referrals_count': referrals['count'],
                        'orders': orders,
                        'notifications': notifications
                    }, default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            if path == 'auth':
                telegram_id = body_data.get('telegram_id')
                username = body_data.get('username')
                first_name = body_data.get('first_name')
                last_name = body_data.get('last_name')
                photo_url = body_data.get('photo_url')
                referral_code_used = body_data.get('referral_code')
                
                if not telegram_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'telegram_id is required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("SELECT * FROM users WHERE telegram_id = %s", (telegram_id,))
                existing_user = cur.fetchone()
                
                if existing_user:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'user': dict(existing_user)}, default=str),
                        'isBase64Encoded': False
                    }
                
                referral_code = generate_referral_code(telegram_id)
                referred_by_id = None
                
                if referral_code_used:
                    cur.execute("SELECT id FROM users WHERE referral_code = %s", (referral_code_used,))
                    referrer = cur.fetchone()
                    if referrer:
                        referred_by_id = referrer['id']
                        cur.execute(
                            "UPDATE users SET balance = balance + 100 WHERE id = %s",
                            (referred_by_id,)
                        )
                
                cur.execute(
                    "INSERT INTO users (telegram_id, username, first_name, last_name, photo_url, referral_code, referred_by_id, balance) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING *",
                    (telegram_id, username, first_name, last_name, photo_url, referral_code, referred_by_id, 1000)
                )
                new_user = cur.fetchone()
                
                if referred_by_id:
                    cur.execute(
                        "INSERT INTO notifications (user_id, title, message, type) VALUES (%s, %s, %s, %s)",
                        (referred_by_id, 'Новый реферал!', f'По вашей ссылке зарегистрировался новый пользователь. +100₽', 'success')
                    )
                
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'user': dict(new_user)}, default=str),
                    'isBase64Encoded': False
                }
            
            elif path == 'order':
                user_id = event.get('headers', {}).get('X-User-Id')
                if not user_id:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Unauthorized'}),
                        'isBase64Encoded': False
                    }
                
                items = body_data.get('items', [])
                if not items:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'No items in order'}),
                        'isBase64Encoded': False
                    }
                
                total = sum(item['price'] * item['quantity'] for item in items)
                
                cur.execute("SELECT balance FROM users WHERE id = %s", (user_id,))
                user = cur.fetchone()
                
                if user['balance'] < total:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Insufficient balance'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "INSERT INTO orders (user_id, total, status) VALUES (%s, %s, %s) RETURNING *",
                    (user_id, total, 'completed')
                )
                order = cur.fetchone()
                
                for item in items:
                    cur.execute(
                        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (%s, %s, %s, %s)",
                        (order['id'], item['product_id'], item['quantity'], item['price'])
                    )
                
                cur.execute(
                    "UPDATE users SET balance = balance - %s WHERE id = %s",
                    (total, user_id)
                )
                
                cur.execute(
                    "INSERT INTO notifications (user_id, title, message, type) VALUES (%s, %s, %s, %s)",
                    (user_id, 'Заказ оформлен', f'Ваш заказ #{order["id"]} успешно оформлен на сумму {total}₽', 'success')
                )
                
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'order': dict(order)}, default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'PUT':
            if path == 'notification':
                body_data = json.loads(event.get('body', '{}'))
                notification_id = body_data.get('notification_id')
                
                cur.execute(
                    "UPDATE notifications SET is_read = true WHERE id = %s",
                    (notification_id,)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Not found'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
