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
('Almond London', 'Crunchy almond coated in chocolate.', 'Flour, Almond, Chocolate', 18.00, 50, 'Cookies', '/product-images/almond_london_1768035835814.jpg'),
('Apple Cinnamon', 'Sweet apple filling with a hint of cinnamon.', 'Flour, Apple, Cinnamon, Sugar', 4.50, 40, 'Muffin', '/product-images/apple_cinnamon_1768035835825.png'),
('Banana Walnut', 'Moist banana cake with crunchy walnuts.', 'Flour, Banana, Walnut, Sugar', 12.00, 25, 'Cake', '/product-images/banana_walnut_1768035835830.jpg'),
('Black Forest Cake', 'Decadent chocolate sponge with cherries.', 'Flour, Cocoa, Cherries, Cream', 16.00, 15, 'Cake', '/product-images/black_forest_cake_1768035835832.jpg'),
('Banana Cupcake', 'Sweet banana flavored cupcake.', 'Flour, Banana, Sugar, Butter', 5.00, 40, 'Cupcake', '/product-images/banana_cupcake_1768035835828.jpg'),
('Blueberry Streusel', 'Topped with sweet crunchy streusel.', 'Flour, Blueberry, Sugar, Butter', 6.00, 35, 'Muffin', '/product-images/blueberry_streusel_1768035835836.png'),
('Burnt Cheesecake', 'Creamy cheesecake with a caramelized top.', 'Cream Cheese, Sugar, Eggs, Flour', 22.00, 10, 'Cake', '/product-images/burnt_cheesecake_1768035835838.jpg'),
('Caramel Popcorn', 'Sweet and salty caramelized popcorn.', 'Corn, Sugar, Butter', 8.00, 60, 'Cookies', '/product-images/caramel_popcorn_1768035835841.jpg'),
('Chocolate Chip', 'Classic crunchy chocolate chip cookies.', 'Flour, Chocolate Chips, Butter', 10.00, 50, 'Cookies', '/product-images/chocolate_chip_1768035835843.jpg'),
('Chocolate Cupcake', 'Rich chocolate cupcake with frosting.', 'Flour, Cocoa, Sugar, Butter', 5.50, 40, 'Cupcake', '/product-images/chocolate_cupcake_1768035835846.jpg'),
('Classic Butter Buttercake', 'Traditional buttery sponge cake.', 'Flour, Butter, Sugar, Eggs', 10.00, 30, 'Cake', '/product-images/classic_butter_buttercake_1768035835849.png'),
('Coconut Lime', 'Zesty lime cake with coconut flakes.', 'Flour, Lime, Coconut, Sugar', 12.00, 20, 'Cake', '/product-images/coconut_lime_1768035835851.png'),
('Cookies & Cream', 'Cookies and cream flavored treat.', 'Flour, Oreo, Sugar, Butter', 12.00, 25, 'Cookies', '/product-images/cookies_cream_1768035835854.png'),
('Double Chocolate Chip', 'Double the chocolate goodness.', 'Flour, Cocoa, Chocolate Chips', 12.00, 40, 'Cookies', '/product-images/double_chocolate_chip_1768035835856.jpg'),
('Double Dark Cocoa', 'Intense dark chocolate flavor.', 'Flour, Dark Cocoa, Sugar', 14.00, 30, 'Cookies', '/product-images/double_dark_cocoa_1768035835859.png'),
('Durian Musang King Crepe', 'Premium Musang King durian layers.', 'Flour, Durian, Cream, Sugar', 25.00, 10, 'Cake', '/product-images/durian_musang_king_crepe_cake_1768035835861.png'),
('Earl Grey Shortbread', 'Buttery shortbread with Earl Grey tea.', 'Flour, Butter, Earl Grey Tea', 15.00, 35, 'Cookies', '/product-images/earl_grey_shortbread_1768035835863.jpg'),
('Honey Corn Muffin', 'Sweet corn muffin with honey glaze.', 'Flour, Cornmeal, Honey, Butter', 5.00, 45, 'Muffin', '/product-images/honey_corn_muffin_1768035835866.jpg'),
('Kek Pandan Gula Melaka', 'Aromatic pandan cake with palm sugar.', 'Flour, Pandan, Gula Melaka', 14.00, 20, 'Cake', '/product-images/kek_pandan_gula_melaka_1768035835868.jpeg'),
('Lemon Cupcake', 'Zesty lemon flavored cupcake.', 'Flour, Lemon, Sugar, Butter', 5.50, 40, 'Cupcake', '/product-images/lemon_cupcake_1768035835870.jpg'),
('Lemon Poppyseed', 'Lemon cake with crunchy poppyseeds.', 'Flour, Lemon, Poppyseeds', 11.00, 30, 'Cake', '/product-images/lemon_poppyseed_1768035835873.jpg'),
('Macadamia White Choc', 'White chocolate cookies with macadamia.', 'Flour, White Choc, Macadamia', 16.00, 35, 'Cookies', '/product-images/macadamia_white_choc_1768035835875.jpg'),
('Mango Mousse Cake', 'Light mango mousse on sponge cake.', 'Mango, Cream, Flour, Sugar', 18.00, 15, 'Cake', '/product-images/mango_mousse_cake_1768035835877.jpg'),
('Milo Dinosaur Cupcake', 'Milo flavored cupcake with extra powder.', 'Flour, Milo, Sugar, Butter', 6.00, 40, 'Cupcake', '/product-images/milo_dinosaur_cupcake_1768035835880.jpg'),
('Oatmeal Raisin', 'Healthy oatmeal cookies with raisins.', 'Oats, Raisins, Flour, Sugar', 9.00, 50, 'Cookies', '/product-images/oatmeal_raisin_1768035835882.jpg'),
('Ondeh-Ondeh Cake', 'Pandan cake with coconut and gula melaka.', 'Flour, Pandan, Coconut, Gula Melaka', 16.00, 20, 'Cake', '/product-images/ondeh_ondeh_cake_1768035835886.png'),
('Peanut Butter Cookies', 'Rich peanut butter flavor.', 'Flour, Peanut Butter, Sugar', 10.00, 45, 'Cookies', '/product-images/peanut_butter_cookies_1768035835888.jpg'),
('Peanut Butter Jelly', 'PB&J remix in a cookie.', 'Flour, Peanut Butter, Jam', 11.00, 40, 'Cookies', '/product-images/peanut_butter_jelly_1768035835890.png'),
('Pineapple Tarts', 'Buttery tart with pineapple jam.', 'Flour, Butter, Pineapple Jam', 20.00, 30, 'Cookies', '/product-images/pineapple_tarts_1768035835892.jpg'),
('Red Velvet w Cream Cheese', 'Red velvet cookie with cream cheese.', 'Flour, Cocoa, Cream Cheese', 12.00, 35, 'Cookies', '/product-images/red_velvet_with_cream_cheese_1768035835894.jpg'),
('Red Velvet w Nuts', 'Red velvet cookie with crunchy nuts.', 'Flour, Cocoa, Nuts, Sugar', 13.00, 35, 'Cookies', '/product-images/red_velvet_with_nuts_cookie_1768035835896.jpg'),
('Salted Caramel', 'Sweet cake with salted caramel drizzle.', 'Flour, Caramel, Salt, Sugar', 14.00, 25, 'Cake', '/product-images/salted_caramel_1768035835900.png'),
('Savory Cheese & Chive', 'Savory scone with cheese and chives.', 'Flour, Cheese, Chives, Butter', 7.00, 40, 'Cookies', '/product-images/savory_cheese_chive_1768035835903.jpg'),
('Strawberry Cupcake', 'Pink strawberry flavored cupcake.', 'Flour, Strawberry, Sugar', 5.50, 40, 'Cupcake', '/product-images/strawberry_cupcake_1768035835905.jpg'),
('Tiramisu (Alcohol-Free)', 'Classic coffee dessert without alcohol.', 'Mascarpone, Coffee, Ladyfingers', 18.00, 15, 'Cake', '/product-images/tiramisu_alcohol_free_1768035835911.jpg'),
('Vanilla Bean', 'Pure vanilla flavored cake.', 'Flour, Vanilla Bean, Sugar', 10.00, 30, 'Cake', '/product-images/vanilla_bean_1768035835913.jpg'),
('Yam Taro Layer Cake', 'Traditional layered yam cake.', 'Flour, Yam/Taro, Sugar', 15.00, 20, 'Cake', '/product-images/yam_taro_layer_cake_1768035835915.png'),
('Signature Chocolate Lava', 'Rich dark chocolate cake with a molten center.', 'Flour, Sugar, 70% Dark Chocolate, Eggs, Butter', 15.00, 20, 'Cake', '/product-images/signature_chocolate_lava_1736355294000.jpeg'),
('Blueberry Crumble Muffin', 'Fresh blueberries topped with crunchy cinnamon crumble.', 'Flour, Blueberries, Cinnamon, Brown Sugar', 5.50, 50, 'Muffin', '/product-images/blueberry_crumble_muffin_1736355294001.jpeg'),
('Classic Red Velvet Cupcake', 'Classic red velvet with cream cheese frosting.', 'Cocoa Powder, Vinegar, Red Dye, Cream Cheese', 8.00, 30, 'Cupcake', '/product-images/red_velvet_cupcake_1736355294002.jpeg'),
('Classic Fruit Tart', 'Fresh fruit tart with custard.', 'Flour, Butter, Custard, Mixed Fruits', 12.00, 20, 'Cake', '/product-images/classic_fruit_tart_1767906945267.jpeg'),
('Triple Chocolate Chunk Cookies', 'Cookies with three types of chocolate.', 'Flour, Dark Chocolate, Milk Chocolate, White Chocolate', 11.00, 40, 'Cookies', '/product-images/triple_chocolate_chunk_cookies_1767907109430.jpeg');