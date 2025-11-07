-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    photo_url TEXT,
    balance DECIMAL(10, 2) DEFAULT 0,
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    referred_by_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    image_url TEXT,
    badge VARCHAR(50),
    rating DECIMAL(2, 1) DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Insert sample products
INSERT INTO products (title, description, category, price, old_price, image_url, badge, rating, in_stock) VALUES
('Cyberpunk 2077', 'Откройте мир Night City в этой захватывающей RPG', 'RPG', 1999, 2999, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400', 'ХИТ', 4.8, true),
('GTA V Premium', 'Легендарная игра с онлайн режимом', 'Экшен', 1499, NULL, 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400', '-33%', 4.9, true),
('The Witcher 3', 'Эпическое приключение Геральта из Ривии', 'RPG', 899, 1499, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400', NULL, 5.0, true),
('Red Dead Redemption 2', 'Вестерн мир с невероятной детализацией', 'Экшен', 2499, NULL, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400', 'НОВИНКА', 4.9, true),
('Elden Ring', 'Темное фэнтези от FromSoftware', 'RPG', 2799, NULL, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', NULL, 4.7, true),
('FIFA 24', 'Новейший симулятор футбола', 'Спорт', 3499, NULL, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400', 'НОВИНКА', 4.5, true),
('Battlefield 2042', 'Масштабные сражения будущего', 'Шутер', 1999, 2999, 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400', '-33%', 4.3, true),
('Hogwarts Legacy', 'Магический мир Гарри Поттера', 'RPG', 2999, NULL, 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400', NULL, 4.8, true),
('Call of Duty: MW3', 'Легендарный шутер возвращается', 'Шутер', 3999, NULL, 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400', 'НОВИНКА', 4.6, true),
('Spider-Man Remastered', 'Станьте легендарным супергероем', 'Экшен', 2299, NULL, 'https://images.unsplash.com/photo-1611532736570-95bc206e52b9?w=400', NULL, 4.9, true),
('Assassins Creed Valhalla', 'Эпоха викингов в новой части', 'Экшен', 1799, 2499, 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400', '-28%', 4.4, true),
('Minecraft', 'Безграничный мир кубиков', 'Песочница', 799, NULL, 'https://images.unsplash.com/photo-1527334919515-b8dee906a34b?w=400', NULL, 4.8, true);
