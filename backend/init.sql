CREATE DATABASE IF NOT EXISTS bakerydb;
USE bakerydb;

-- 1. Users Table (No address, added Phone Number)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE, -- Added (Must be unique)
    first_name VARCHAR(50) NOT NULL,      -- Replaces full_name
    last_name VARCHAR(50) NOT NULL,       -- Replaces full_name
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    gender VARCHAR(10),                   -- e.g., 'Male', 'Female'
    birthdate DATE,                       -- SQL Date format (YYYY-MM-DD)
    role ENUM('CUSTOMER', 'ADMIN') DEFAULT 'CUSTOMER'
);

-- 2. Products Table (Added Ingredients & Stock)
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT, -- Marketing text
    ingredients TEXT, -- Allergy info
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category VARCHAR(50), -- e.g. "Cake", "Muffin"
    image_url VARCHAR(255)
);

-- 3. Orders Table (Pickup Logic)
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    pickup_time DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 4. Order Items (What cakes are inside the order?)
CREATE TABLE order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 5. Feedback (Ratings)
CREATE TABLE feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 6. Categories (Dynamic)
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(50) NOT NULL,
    icon_url VARCHAR(255)
);

-- Default categories
INSERT INTO categories (name, display_name, icon_url) VALUES
('Cake', 'Cakes', '/category-icons/cake.png'),
('Muffin', 'Muffins', '/category-icons/muffin.png'),
('Cupcake', 'Cupcakes', '/category-icons/cupcake.png'),
('Cookies', 'Cookies', '/category-icons/cookies.png');

-- =============================================
-- DUMMY DATA (So your website isn't empty)
-- =============================================

INSERT INTO users (username, first_name, last_name, email, password, role, phone_number, gender, birthdate)
VALUES
('admin_boss', 'Bakery', 'Owner', 'admin@bakery.com', '12345', 'ADMIN', '012-3456789', 'Male', '1990-01-01'),
('john_doe', 'John', 'Doe', 'john@gmail.com', '12345', 'CUSTOMER', '019-8765432', 'Male', '2000-05-15');

-- 3. Products
INSERT INTO products (name, description, ingredients, price, stock_quantity, category, image_url) VALUES
('Signature Chocolate Lava', 'Rich dark chocolate cake with a molten center.', 'Flour, Sugar, 70% Dark Chocolate, Eggs, Butter', 15.00, 20, 'Cake', '/images/chocolate-lava.png'),
('Blueberry Crumble Muffin', 'Fresh blueberries topped with crunchy cinnamon crumble.', 'Flour, Blueberries, Cinnamon, Brown Sugar', 5.50, 50, 'Muffin', '/images/blueberry-muffin.png'),
('Red Velvet Cupcake', 'Classic red velvet with cream cheese frosting.', 'Cocoa Powder, Vinegar, Red Dye, Cream Cheese', 8.00, 30, 'Cupcake', '/images/red-velvet.png');