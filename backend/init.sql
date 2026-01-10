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

-- =============================================
-- DUMMY DATA (So your website isn't empty)
-- =============================================

INSERT INTO users (username, first_name, last_name, email, password, role, phone_number, gender, birthdate)
VALUES
('admin_boss', 'Bakery', 'Owner', 'admin@bakery.com', '12345', 'ADMIN', '012-3456789', 'Male', '1990-01-01'),
('john_doe', 'John', 'Doe', 'john@gmail.com', '12345', 'CUSTOMER', '019-8765432', 'Male', '2000-05-15');

-- 3. Products
INSERT INTO products (name, description, ingredients, price, stock_quantity, category, image_url) VALUES

('Almond London', 'Crunchy almond coated in chocolate.', 'Flour, Almond, Chocolate', 18.00, 50, 'Cookies', '/images/Almond London.jpg'),
('Apple Cinnamon', 'Sweet apple filling with a hint of cinnamon.', 'Flour, Apple, Cinnamon, Sugar', 4.50, 40, 'Muffin', '/images/Apple Cinnamon.png'),
('Banana Walnut', 'Moist banana cake with crunchy walnuts.', 'Flour, Banana, Walnut, Sugar', 12.00, 25, 'Cake', '/images/Banana Walnut.jpg'),
('Black Forest Cake', 'Decadent chocolate sponge with cherries.', 'Flour, Cocoa, Cherries, Cream', 16.00, 15, 'Cake', '/images/Black Forest Cake.jpg'),
('Banana Cupcake', 'Sweet banana flavored cupcake.', 'Flour, Banana, Sugar, Butter', 5.00, 40, 'Cupcake', '/images/Banana Cupcake.jpg'),
('Blueberry Streusel', 'Topped with sweet crunchy streusel.', 'Flour, Blueberry, Sugar, Butter', 6.00, 35, 'Muffin', '/images/Blueberry Streusel.png'),
('Burnt Cheesecake', 'Creamy cheesecake with a caramelized top.', 'Cream Cheese, Sugar, Eggs, Flour', 22.00, 10, 'Cake', '/images/Burnt Cheesecake.jpg'),
('Caramel Popcorn', 'Sweet and salty caramelized popcorn.', 'Corn, Sugar, Butter', 8.00, 60, 'Cookies', '/images/Caramel Popcorn.jpg'),
('Chocolate Chip', 'Classic crunchy chocolate chip cookies.', 'Flour, Chocolate Chips, Butter', 10.00, 50, 'Cookies', '/images/Chocolate Chip.jpg'),
('Chocolate Cupcake', 'Rich chocolate cupcake with frosting.', 'Flour, Cocoa, Sugar, Butter', 5.50, 40, 'Cupcake', '/images/Chocolate Cupcake.jpg'),
('Classic Butter Buttercake', 'Traditional buttery sponge cake.', 'Flour, Butter, Sugar, Eggs', 10.00, 30, 'Cake', '/images/Classic Butter Buttercake.png'),
('Coconut Lime', 'Zesty lime cake with coconut flakes.', 'Flour, Lime, Coconut, Sugar', 12.00, 20, 'Cake', '/images/Coconut Lime.png'),
('Cookies & Cream', 'Cookies and cream flavored treat.', 'Flour, Oreo, Sugar, Butter', 12.00, 25, 'Cookies', '/images/Cookies & Cream.png'),
('Double Chocolate Chip', 'Double the chocolate goodness.', 'Flour, Cocoa, Chocolate Chips', 12.00, 40, 'Cookies', '/images/Double Chocolate Chip.jpg'),
('Double Dark Cocoa', 'Intense dark chocolate flavor.', 'Flour, Dark Cocoa, Sugar', 14.00, 30, 'Cookies', '/images/Double Dark Cocoa.png'),
('Durian Musang King Crepe', 'Premium Musang King durian layers.', 'Flour, Durian, Cream, Sugar', 25.00, 10, 'Cake', '/images/Durian Musang King Crepe Cake.png'),
('Earl Grey Shortbread', 'Buttery shortbread with Earl Grey tea.', 'Flour, Butter, Earl Grey Tea', 15.00, 35, 'Cookies', '/images/Earl Grey Shortbread.jpg'),
('Honey Corn Muffin', 'Sweet corn muffin with honey glaze.', 'Flour, Cornmeal, Honey, Butter', 5.00, 45, 'Muffin', '/images/Honey Corn Muffin.jpg'),
('Kek Pandan Gula Melaka', 'Aromatic pandan cake with palm sugar.', 'Flour, Pandan, Gula Melaka', 14.00, 20, 'Cake', '/images/Kek_Pandan_Gula_Melaka.jpeg'),
('Lemon Cupcake', 'Zesty lemon flavored cupcake.', 'Flour, Lemon, Sugar, Butter', 5.50, 40, 'Cupcake', '/images/Lemon Cupcake.jpg'),
('Lemon Poppyseed', 'Lemon cake with crunchy poppyseeds.', 'Flour, Lemon, Poppyseeds', 11.00, 30, 'Cake', '/images/Lemon Poppyseed.jpg'),
('Macadamia White Choc', 'White chocolate cookies with macadamia.', 'Flour, White Choc, Macadamia', 16.00, 35, 'Cookies', '/images/Macadamia White Choc.jpg'),
('Mango Mousse Cake', 'Light mango mousse on sponge cake.', 'Mango, Cream, Flour, Sugar', 18.00, 15, 'Cake', '/images/Mango Mousse Cake.jpg'),
('Milo Dinosaur Cupcake', 'Milo flavored cupcake with extra powder.', 'Flour, Milo, Sugar, Butter', 6.00, 40, 'Cupcake', '/images/Milo Dinosaur Cupcake.jpg'),
('Oatmeal Raisin', 'Healthy oatmeal cookies with raisins.', 'Oats, Raisins, Flour, Sugar', 9.00, 50, 'Cookies', '/images/Oatmeal Raisin.jpg'),
('Ondeh-Ondeh Cake', 'Pandan cake with coconut and gula melaka.', 'Flour, Pandan, Coconut, Gula Melaka', 16.00, 20, 'Cake', '/images/Ondeh-Ondeh Cake.png'),
('Peanut Butter Cookies', 'Rich peanut butter flavor.', 'Flour, Peanut Butter, Sugar', 10.00, 45, 'Cookies', '/images/Peanut Butter Cookies.jpg'),
('Peanut Butter Jelly', 'PB&J remix in a cookie.', 'Flour, Peanut Butter, Jam', 11.00, 40, 'Cookies', '/images/Peanut Butter Jelly.png'),
('Pineapple Tarts', 'Buttery tart with pineapple jam.', 'Flour, Butter, Pineapple Jam', 20.00, 30, 'Cookies', '/images/Pineapple Tarts.jpg'),
('Red Velvet w Cream Cheese', 'Red velvet cookie with cream cheese.', 'Flour, Cocoa, Cream Cheese', 12.00, 35, 'Cookies', '/images/Red Velvet with Cream Cheese.jpg'),
('Red Velvet w Nuts', 'Red velvet cookie with crunchy nuts.', 'Flour, Cocoa, Nuts, Sugar', 13.00, 35, 'Cookies', '/images/Red Velvet with Nuts Cookie.jpg'),
('Salted Caramel', 'Sweet cake with salted caramel drizzle.', 'Flour, Caramel, Salt, Sugar', 14.00, 25, 'Cake', '/images/Salted Caramel.png'),
('Savory Cheese & Chive', 'Savory scone with cheese and chives.', 'Flour, Cheese, Chives, Butter', 7.00, 40, 'Cookies', '/images/Savory Cheese & Chive.jpg'),
('Strawberry Cupcake', 'Pink strawberry flavored cupcake.', 'Flour, Strawberry, Sugar', 5.50, 40, 'Cupcake', '/images/Strawberry Cupcake.jpg'),
('Tiramisu (Alcohol-Free)', 'Classic coffee dessert without alcohol.', 'Mascarpone, Coffee, Ladyfingers', 18.00, 15, 'Cake', '/images/Tiramisu (Alcohol-Free).jpg'),
('Vanilla Bean', 'Pure vanilla flavored cake.', 'Flour, Vanilla Bean, Sugar', 10.00, 30, 'Cake', '/images/Vanilla Bean.jpg'),
('Yam Taro Layer Cake', 'Traditional layered yam cake.', 'Flour, Yam/Taro, Sugar', 15.00, 20, 'Cake', '/images/Yam Taro Layer Cake.png');