-- CREATE DATABASE IF NOT EXISTS bakerydb;
-- USE bakerydb;

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
('Cookies', 'Cookies', '/category-icons/cookies.png'),
('Tart', 'Tarts', '/category-icons/tart.png'),
('Donut', 'Donuts', '/category-icons/category_donuts_1768050135081.png'),
('Bread', 'Bread and Bun', '/category-icons/category_bread_and_bun_1768048750948.png'),
('Croissant', 'Croissants', '/category-icons/category_croissants_1768049425684.png'),
('Loaves', 'Loaves', '/category-icons/category_loaves_1768048487607.png');

INSERT INTO users (username, first_name, last_name, email, password, role, phone_number, gender, birthdate)
VALUES
('admin_boss', 'Bakery', 'Owner', 'admin@bakery.com', '12345', 'ADMIN', '012-3456789', 'Male', '1990-01-01'),
('john_doe', 'John', 'Doe', 'john@gmail.com', '12345', 'CUSTOMER', '019-8765432', 'Male', '2000-05-15');

-- 3. Products
INSERT INTO products (name, description, ingredients, price, stock_quantity, category, image_url) VALUES
('Almond London', 'Crunchy almond coated in chocolate.', 'Flour, Almond, Chocolate', 18.00, 50, 'Cookies', '/product-images/almond_london_1768035835814.jpg'),
('Apple Cinnamon', 'Sweet apple filling with a hint of cinnamon.', 'Flour, Apple, Cinnamon, Sugar', 4.50, 40, 'Muffin', '/product-images/apple_cinnamon_1768035835825.png'),
('Banana Walnut', 'Moist banana cake with crunchy walnuts.', 'Flour, Banana, Walnut, Sugar', 12.00, 25, 'Muffin', '/product-images/banana_walnut_1768035835830.jpg'),
('Black Forest Cake', 'Decadent chocolate sponge with cherries.', 'Flour, Cocoa, Cherries, Cream', 16.00, 15, 'Cake', '/product-images/black_forest_cake_1768035835832.jpg'),
('Banana Cupcake', 'Sweet banana flavored cupcake.', 'Flour, Banana, Sugar, Butter', 5.00, 40, 'Cupcake', '/product-images/banana_cupcake_1768035835828.jpg'),
('Blueberry Streusel', 'Topped with sweet crunchy streusel.', 'Flour, Blueberry, Sugar, Butter', 6.00, 35, 'Muffin', '/product-images/blueberry_streusel_1768035835836.png'),
('Burnt Cheesecake', 'Creamy cheesecake with a caramelized top.', 'Cream Cheese, Sugar, Eggs, Flour', 22.00, 10, 'Cake', '/product-images/burnt_cheesecake_1768035835838.jpg'),
('Caramel Popcorn Cupcakes', 'Sweet and salty caramelized popcorn.', 'Corn, Sugar, Butter', 8.00, 60, 'Cupcake', '/product-images/caramel_popcorn_1768035835841.jpg'),
('Chocolate Chip', 'Classic crunchy chocolate chip cookies.', 'Flour, Chocolate Chips, Butter', 10.00, 50, 'Cookies', '/product-images/chocolate_chip_1768035835843.jpg'),
('Chocolate Cupcake', 'Rich chocolate cupcake with frosting.', 'Flour, Cocoa, Sugar, Butter', 5.50, 40, 'Cupcake', '/product-images/chocolate_cupcake_1768035835846.jpg'),
('Classic Butter Buttercake', 'Traditional buttery sponge cake.', 'Flour, Butter, Sugar, Eggs', 10.00, 30, 'Cake', '/product-images/classic_butter_buttercake_1768035835849.png'),
('Coconut Lime Cupcakes', 'Zesty lime cake with coconut flakes.', 'Flour, Lime, Coconut, Sugar', 12.00, 20, 'Cupcake', '/product-images/coconut_lime_1768035835851.png'),
('Cookies & Cream Cupcakes', 'Cookies and cream flavored treat.', 'Flour, Oreo, Sugar, Butter', 12.00, 25, 'Cupcake', '/product-images/cookies_cream_1768035835854.png'),
('Double Chocolate Chip', 'Double the chocolate goodness.', 'Flour, Cocoa, Chocolate Chips', 12.00, 40, 'Cookies', '/product-images/double_chocolate_chip_1768035835856.jpg'),
('Double Dark Cocoa', 'Intense dark chocolate flavor.', 'Flour, Dark Cocoa, Sugar', 14.00, 30, 'Cookies', '/product-images/double_dark_cocoa_1768035835859.png'),
('Durian Musang King Crepe', 'Premium Musang King durian layers.', 'Flour, Durian, Cream, Sugar', 25.00, 10, 'Cake', '/product-images/durian_musang_king_crepe_cake_1768035835861.png'),
('Earl Grey Shortbread', 'Buttery shortbread with Earl Grey tea.', 'Flour, Butter, Earl Grey Tea', 15.00, 35, 'Cookies', '/product-images/earl_grey_shortbread_1768035835863.jpg'),
('Honey Corn Muffin', 'Sweet corn muffin with honey glaze.', 'Flour, Cornmeal, Honey, Butter', 5.00, 45, 'Muffin', '/product-images/honey_corn_muffin_1768035835866.jpg'),
('Kek Pandan Gula Melaka', 'Aromatic pandan cake with palm sugar.', 'Flour, Pandan, Gula Melaka', 14.00, 20, 'Cake', '/product-images/kek_pandan_gula_melaka_1768035835868.jpeg'),
('Lemon Cupcake', 'Zesty lemon flavored cupcake.', 'Flour, Lemon, Sugar, Butter', 5.50, 40, 'Cupcake', '/product-images/lemon_cupcake_1768035835870.jpg'),
('Lemon Poppyseed', 'Lemon cake with crunchy poppyseeds.', 'Flour, Lemon, Poppyseeds', 11.00, 30, 'Muffin', '/product-images/lemon_poppyseed_1768035835873.jpg'),
('Macadamia White Choc', 'White chocolate cookies with macadamia.', 'Flour, White Choc, Macadamia', 16.00, 35, 'Cookies', '/product-images/macadamia_white_choc_1768035835875.jpg'),
('Mango Mousse Cake', 'Light mango mousse on sponge cake.', 'Mango, Cream, Flour, Sugar', 18.00, 15, 'Cake', '/product-images/mango_mousse_cake_1768035835877.jpg'),
('Milo Dinosaur Cupcake', 'Milo flavored cupcake with extra powder.', 'Flour, Milo, Sugar, Butter', 6.00, 40, 'Cupcake', '/product-images/milo_dinosaur_cupcake_1768035835880.jpg'),
('Oatmeal Raisin', 'Healthy oatmeal cookies with raisins.', 'Oats, Raisins, Flour, Sugar', 9.00, 50, 'Cookies', '/product-images/oatmeal_raisin_1768035835882.jpg'),
('Ondeh-Ondeh Cake', 'Pandan cake with coconut and gula melaka.', 'Flour, Pandan, Coconut, Gula Melaka', 16.00, 20, 'Cake', '/product-images/ondeh_ondeh_cake_1768035835886.png'),
('Peanut Butter Cookies', 'Rich peanut butter flavor.', 'Flour, Peanut Butter, Sugar', 10.00, 45, 'Cookies', '/product-images/peanut_butter_cookies_1768035835888.jpg'),
('Peanut Butter Jelly Cupcakes', 'PB&J remix in a cookie.', 'Flour, Peanut Butter, Jam', 11.00, 40, 'Cupcake', '/product-images/peanut_butter_jelly_1768035835890.png'),
('Pineapple Tarts', 'Buttery tart with pineapple jam.', 'Flour, Butter, Pineapple Jam', 20.00, 30, 'Tart', '/product-images/pineapple_tarts_1768035835892.jpg'),
('Red Velvet w Cream Cheese', 'Red velvet cookie with cream cheese.', 'Flour, Cocoa, Cream Cheese', 12.00, 35, 'Cake', '/product-images/red_velvet_with_cream_cheese_1768035835894.jpg'),
('Red Velvet w Nuts', 'Red velvet cookie with crunchy nuts.', 'Flour, Cocoa, Nuts, Sugar', 13.00, 35, 'Cookies', '/product-images/red_velvet_with_nuts_cookie_1768035835896.jpg'),
('Salted Caramel', 'Sweet cake with salted caramel drizzle.', 'Flour, Caramel, Salt, Sugar', 14.00, 25, 'Cupcake', '/product-images/salted_caramel_1768035835900.png'),
('Savory Cheese & Chive', 'Savory scone with cheese and chives.', 'Flour, Cheese, Chives, Butter', 7.00, 40, 'Muffin', '/product-images/savory_cheese_chive_1768035835903.jpg'),
('Strawberry Cupcake', 'Pink strawberry flavored cupcake.', 'Flour, Strawberry, Sugar', 5.50, 40, 'Cupcake', '/product-images/strawberry_cupcake_1768035835905.jpg'),
('Tiramisu (Alcohol-Free)', 'Classic coffee dessert without alcohol.', 'Mascarpone, Coffee, Ladyfingers', 18.00, 15, 'Cake', '/product-images/tiramisu_alcohol_free_1768035835911.jpg'),
('Vanilla Bean', 'Pure vanilla flavored cake.', 'Flour, Vanilla Bean, Sugar', 10.00, 30, 'Cupcake', '/product-images/vanilla_bean_1768035835913.jpg'),
('Yam Taro Layer Cake', 'Traditional layered yam cake.', 'Flour, Yam/Taro, Sugar', 15.00, 20, 'Cake', '/product-images/yam_taro_layer_cake_1768035835915.png'),
('Signature Chocolate Lava', 'Rich dark chocolate cake with a molten center.', 'Flour, Sugar, 70% Dark Chocolate, Eggs, Butter', 15.00, 20, 'Cake', '/product-images/signature_chocolate_lava_1736355294000.jpeg'),
('Blueberry Crumble Muffin', 'Fresh blueberries topped with crunchy cinnamon crumble.', 'Flour, Blueberries, Cinnamon, Brown Sugar', 5.50, 50, 'Muffin', '/product-images/blueberry_crumble_muffin_1736355294001.jpeg'),
('Classic Red Velvet Cupcake', 'Classic red velvet with cream cheese frosting.', 'Cocoa Powder, Vinegar, Red Dye, Cream Cheese', 8.00, 30, 'Cupcake', '/product-images/red_velvet_cupcake_1736355294002.jpeg'),
('Classic Fruit Tart', 'Fresh fruit tart with custard.', 'Flour, Butter, Custard, Mixed Fruits', 12.00, 20, 'Tart', '/product-images/classic_fruit_tart_1767906945267.jpeg'),
('Triple Chocolate Chunk Cookies', 'Cookies with three types of chocolate.', 'Flour, Dark Chocolate, Milk Chocolate, White Chocolate', 11.00, 40, 'Cookies', '/product-images/triple_chocolate_chunk_cookies_1767907109430.jpeg'),
('Almond Croissant', 'Flaky almond croissant.', 'Flour, Butter, Almond', 12.00, 20, 'Croissant', '/product-images/Almond Croissant.jpg'),
('Biscoff Speculoos Donut', 'Donut with Biscoff spread.', 'Flour, Sugar, Biscoff', 6.00, 30, 'Donut', '/product-images/Biscoff Speculoos Donut.jpg'),
('Boston Cream Donut', 'Classic custard filled donut.', 'Flour, Custard, Chocolate', 5.00, 30, 'Donut', '/product-images/Boston Cream Donut.jpg'),
('Cheese Stick Bun', 'Savor cheese stick bun.', 'Flour, Cheese, Butter', 4.00, 40, 'Bread', '/product-images/Cheese Stick Bun.jpg'),
('Chicken Floss Bun', 'Bun topped with chicken floss.', 'Flour, Chicken Floss, Mayo', 5.00, 40, 'Bread', '/product-images/Chicken Floss Bun.jpg'),
('Chocolate Glazed Donut', 'Classic chocolate glaze.', 'Flour, Cocoa, Sugar', 4.50, 40, 'Donut', '/product-images/Chocolate Glazed Donut.jpg'),
('Cinnamon Sugar Twist', 'Twisted donut with cinnamon.', 'Flour, Cinnamon, Sugar', 4.00, 40, 'Donut', '/product-images/Cinnamon Sugar Twist.jpg'),
('Classic French Butter', 'Authentic French butter croissant.', 'Flour, French Butter', 8.00, 30, 'Croissant', '/product-images/Classic French Butter.jpg'),
('Classic Sugar Raised', 'Simple sugar raised donut.', 'Flour, Sugar', 3.50, 50, 'Donut', '/product-images/Classic Sugar Raised.jpg'),
('Cream Garlic Bread', 'Garlic bread with cream cheese.', 'Flour, Garlic, Cream Cheese', 8.00, 25, 'Bread', '/product-images/Cream Garlic Bread.jpg'),
('Curry Potato Bun', 'Bun filled with curry potato.', 'Flour, Potato, Curry', 4.50, 40, 'Bread', '/product-images/Curry Potato Bun.jpg'),
('Durian Cream Bomb', 'Donut filled with durian cream.', 'Flour, Durian, Cream', 8.00, 20, 'Donut', '/product-images/Durian Cream Bomb.png'),
('French Bread', 'Traditional French baguette.', 'Flour, Yeast, Water', 7.00, 20, 'Loaves', '/product-images/French Bread.jpg'),
('Garlic Butter Croissant', 'Savory garlic butter croissant.', 'Flour, Garlic, Butter', 9.00, 25, 'Croissant', '/product-images/Garlic Butter Croissant.jpg'),
('Ham & Cheese Croissant', 'Classic ham and cheese bun.', 'Flour, Ham, Cheese', 5.50, 35, 'Croissant', '/product-images/Ham & Cheese.jpg'),
('Hotdog Bread Bun', 'Classic hotdog bun.', 'Flour, Sausage, Bread', 5.00, 40, 'Bread', '/product-images/Hotdog Bread Bun.jpg'),
('Ikan Bilis Bun', 'Spicy anchovy bun.', 'Flour, Ikan Bilis, Sambal', 4.50, 40, 'Bread', '/product-images/Ikan Bilis Bun.jpg'),
('Kouign-Amann Croissant', 'Caramelized buttery pastry.', 'Flour, Butter, Sugar', 10.00, 20, 'Croissant', '/product-images/Kouign-Amann Croissant.jpg'),
('Matcha White Choc', 'Matcha white chocolate treat.', 'Flour, Matcha, White Chocolate', 8.00, 30, 'Cookies', '/product-images/Matcha White Choc.png'),
('Matcha Zen Donut', 'Matcha glazed donut.', 'Flour, Matcha, Sugar', 5.00, 35, 'Donut', '/product-images/Matcha Zen Donut.jpg'),
('Mexican Coffee Bun', 'Coffee topping with butter filling.', 'Flour, Coffee, Butter', 5.00, 40, 'Bread', '/product-images/Mexican Coffee Bun.jpg'),
('Pain au Chocolat Croissant', 'Chocolate filled croissant.', 'Flour, Chocolate, Butter', 9.00, 30, 'Croissant', '/product-images/Pain au Chocolat Croissant.jpg'),
('Polo Bun', 'Pineapple crust bun.', 'Flour, Butter, Sugar', 4.50, 40, 'Bread', '/product-images/Polo Bun.jpg'),
('Salted Egg Yolk Lava', 'Molten salted egg yolk filling.', 'Flour, Salted Egg, Butter', 9.00, 25, 'Croissant', '/product-images/Salted Egg Yolk Lava.jpg'),
('Sausage Roll', 'Sausage wrapped in pastry.', 'Flour, Sausage, Butter', 6.00, 35, 'Bread', '/product-images/Sausage Roll.jpg'),
('Strawberry Cream Croissant', 'Croissant with fresh strawberry cream.', 'Flour, Strawberry, Cream', 11.00, 20, 'Croissant', '/product-images/Strawberry Cream Croissant.jpeg'),
('Strawberry Ring Donut', 'Pink strawberry glazed donut.', 'Flour, Strawberry, Sugar', 4.50, 40, 'Donut', '/product-images/Strawberry Ring Donut.jpg'),
('Sweet Corn Bun', 'Bun filled with sweet corn.', 'Flour, Corn, Butter', 4.00, 40, 'Bread', '/product-images/Sweet Corn Bun.jpg'),
('Tuna Mayo Bun', 'Bun filled with tuna mayo.', 'Flour, Tuna, Mayo', 5.00, 35, 'Bread', '/product-images/Tuna Mayo Bun.png'),
('Turkey Slice & Cranberry', 'Savory turkey and cranberry roll.', 'Flour, Turkey, Cranberry', 6.00, 30, 'Bread', '/product-images/Turkey Slice & Cranberry.jpg'),
('White Bread', 'Classic white loaf.', 'Flour, Milk, Butter', 6.00, 20, 'Loaves', '/product-images/White Bread.jpg'),
('Whole Wheat Bread', 'Healthy whole wheat loaf.', 'Whole Wheat Flour, Water', 7.00, 20, 'Loaves', '/product-images/Whole Wheat Bread.png');

-- 4. Dummy Reviews (Feedback) for all products
-- Using user_id 2 (john_doe) for most, and 1 (admin) for some variety
INSERT INTO feedback (user_id, product_id, rating, comment) VALUES
-- Cookies reviews
(2, 1, 5, 'Absolutely delicious! The almond chocolate coating is perfect.'),
(2, 9, 4, 'Classic cookies, just like grandma used to make!'),
(2, 14, 5, 'Double chocolate heaven! Will order again.'),
(2, 15, 4, 'Rich dark cocoa flavor, not too sweet.'),
(2, 17, 5, 'Love the Earl Grey flavor, so unique!'),
(2, 22, 4, 'Great macadamia and white chocolate combo.'),
(2, 25, 4, 'Healthy and tasty oatmeal raisin cookies.'),
(2, 27, 5, 'Rich peanut butter flavor, highly recommend!'),
(2, 31, 5, 'Red velvet with nuts is an amazing combo!'),
(2, 42, 5, 'Triple chocolate is a chocoholic dream!'),
(2, 51, 4, 'Matcha with white chocolate is refreshing!'),

-- Muffin reviews
(2, 2, 5, 'The apple cinnamon flavor is amazing for breakfast!'),
(2, 3, 4, 'Moist and delicious banana walnut muffin.'),
(2, 6, 5, 'The streusel topping is absolutely amazing!'),
(2, 18, 4, 'Sweet honey corn muffin, perfect with coffee.'),
(2, 21, 5, 'Lemon poppyseed is so refreshing!'),
(2, 33, 4, 'Love the savory cheese and chive flavor.'),
(2, 39, 5, 'Best blueberry muffin I have ever had!'),

-- Cake reviews
(2, 4, 5, 'Black Forest cake is a classic! Cherry filling is divine.'),
(2, 7, 5, 'Burnt cheesecake has the perfect texture!'),
(2, 11, 4, 'Classic butter cake, simple but delicious.'),
(2, 16, 5, 'Durian Musang King is premium quality!'),
(2, 19, 5, 'Pandan Gula Melaka is authentic Malaysian taste!'),
(2, 23, 4, 'Mango mousse is light and refreshing.'),
(2, 26, 5, 'Ondeh-Ondeh cake brings back childhood memories!'),
(2, 30, 5, 'Red Velvet with cream cheese is heavenly!'),
(2, 35, 5, 'Tiramisu alcohol-free is safe for everyone!'),
(2, 37, 4, 'Yam Taro Layer Cake has great texture.'),
(2, 38, 5, 'Signature Chocolate Lava is a must-try!'),

-- Cupcake reviews
(2, 5, 4, 'Banana cupcake is moist and flavorful.'),
(2, 8, 5, 'Caramel popcorn topping is so creative!'),
(2, 10, 5, 'Chocolate cupcake with rich frosting!'),
(2, 12, 4, 'Coconut lime is a tropical delight.'),
(2, 13, 5, 'Cookies and cream is my favorite flavor!'),
(2, 20, 4, 'Lemon cupcake is zesty and refreshing.'),
(2, 24, 5, 'Milo Dinosaur cupcake is uniquely Malaysian!'),
(2, 28, 4, 'PB&J cupcake reminds me of childhood.'),
(2, 32, 5, 'Salted caramel is the perfect balance!'),
(2, 34, 4, 'Strawberry cupcake is pretty and tasty.'),
(2, 36, 5, 'Vanilla bean has pure vanilla flavor.'),
(2, 40, 5, 'Red velvet cupcake with cream cheese frosting!'),

-- Tart reviews
(2, 29, 5, 'Pineapple tarts are buttery perfection!'),
(2, 41, 4, 'Classic fruit tart with fresh fruits!'),

-- Donut reviews
(2, 44, 5, 'Biscoff Speculoos is amazingly delicious!'),
(2, 45, 4, 'Boston Cream is a classic favorite.'),
(2, 48, 4, 'Chocolate glazed donut is simple but good.'),
(2, 49, 5, 'Cinnamon sugar twist is so addictive!'),
(2, 50, 4, 'Sugar raised donut is light and fluffy.'),
(2, 54, 5, 'Durian cream bomb is unique and amazing!'),
(2, 52, 4, 'Matcha Zen donut has authentic matcha flavor.'),
(2, 59, 4, 'Strawberry ring donut is cute and tasty!'),

-- Bread reviews
(2, 46, 4, 'Cheese stick bun is savory and delicious.'),
(2, 47, 5, 'Chicken floss bun is my go-to snack!'),
(2, 53, 5, 'Curry potato bun has amazing filling!'),
(2, 58, 4, 'Hotdog bun is perfect for quick meals.'),
(2, 63, 5, 'Ikan Bilis bun is spicy and flavorful!'),
(2, 67, 5, 'Mexican coffee bun has the best butter filling!'),
(2, 69, 4, 'Polo bun has nice pineapple crust.'),
(2, 71, 5, 'Sausage roll is crispy and savory!'),
(2, 74, 4, 'Sweet corn bun is soft and sweet.'),
(2, 75, 4, 'Tuna mayo bun is a filling snack.'),
(2, 76, 5, 'Turkey cranberry combo is delicious!'),
(2, 55, 5, 'Cream garlic bread is heavenly aromatic!'),

-- Loaves reviews
(2, 56, 4, 'French bread is authentic and crusty.'),
(2, 77, 4, 'White bread is soft and perfect for sandwiches.'),
(2, 78, 5, 'Whole wheat bread is healthy and tasty!'),

-- Croissant reviews
(2, 43, 5, 'Almond croissant is flaky and nutty perfection!'),
(2, 57, 4, 'Classic French butter croissant is authentic.'),
(2, 60, 5, 'Garlic butter croissant is uniquely savory!'),
(2, 61, 4, 'Ham and cheese croissant is filling.'),
(2, 64, 5, 'Kouign-Amann is caramelized heaven!'),
(2, 68, 5, 'Pain au Chocolat has the best chocolate!'),
(2, 70, 5, 'Salted egg yolk lava is so creative!'),
(2, 72, 5, 'Strawberry cream croissant is beautiful and tasty!');