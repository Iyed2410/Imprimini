-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create user_settings table if not exists
CREATE TABLE IF NOT EXISTS user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    full_name TEXT,
    phone TEXT,
    bio TEXT,
    avatar_url TEXT,
    dark_mode BOOLEAN DEFAULT 0,
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'GMT+1',
    email_notifications BOOLEAN DEFAULT 1,
    order_updates BOOLEAN DEFAULT 1,
    promotional_emails BOOLEAN DEFAULT 0,
    newsletter BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create product categories table if not exists
CREATE TABLE IF NOT EXISTS product_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- Create product sizes table if not exists
CREATE TABLE IF NOT EXISTS product_sizes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- Create product colors table if not exists
CREATE TABLE IF NOT EXISTS product_colors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT,
    product_id INTEGER,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create products table if not exists
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    image TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table if not exists
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert default admin user only if it doesn't exist
INSERT OR IGNORE INTO users (username, password, email, role) 
VALUES ('admin', '$2a$10$hRjSj4T9dr0ci8/NNi1gyeugzDUSzjem98WK8z8/yBtiEnh6v.PpC', 'admin@imprimini.com', 'admin');

-- Insert products from products.json
INSERT OR REPLACE INTO products (id, name, description, price, stock, image, category) VALUES 
(1, 'Classic T-Shirt', 'Premium cotton t-shirt perfect for custom designs', 20, 100, './img/product/01_Classic_Organic_Tee-T-shirt-CS1001-Deep_Black.jpg', 'Clothing'),
(2, 'Hoodie', 'Comfortable hoodie for all seasons', 40, 100, './img/product/04_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Deep_Black.jpg', 'Clothing'),
(3, 'Classic Mug', 'Ceramic mug perfect for hot beverages', 15, 100, './img/product/Ceramic-Coffee-Mug.jpg', 'Mugs'),
(4, 'Color Changing Mug', 'Magic mug that reveals design when hot', 20, 100, './img/product/product-4.jpg', 'Mugs'),
(5, 'Oversized Crew', 'Comfortable and stylish oversized crew neck sweatshirt', 40, 100, './img/product/10_Organic_Oversized_Crew-Oversized_Crew-CS1012-Deep_Black.jpg', 'Clothing'),
(6, 'Sweatpants', 'Comfortable organic cotton sweatpants with modern fit', 50, 100, './img/product/01_Organic_Sweatpants-Pants-CS1011-Oyster_Grey_6e5b059a-26a1-41b8-a848-fecfbfb9d48f.jpg', 'Clothing'),
(7, 'Wool Hat', 'Premium Merino wool hat for ultimate comfort and style', 45, 100, './img/product/04_Merino_Wool_Hat-Hat-CS5085-Scarlet_Red_01df4d62-f2e6-4fed-b0ae-231ad1fa657d.jpg', 'Clothing');

-- Insert product colors for Classic T-Shirt
INSERT INTO product_colors (name, image, product_id) VALUES
('Deep Black', './img/product/01_Classic_Organic_Tee-T-shirt-CS1001-Deep_Black.jpg', 1),
('Optical White', './img/product/02_Classic_Organic_Tee-T-shirt-CS1001-Optical_White.jpg', 1),
('Oxblood Red', './img/product/03_Classic_Organic_Tee-T-shirt-CS1001-Oxblood_Red_e2cc926c-bd41-4fd8-b99e-fd821648d11f.jpg', 1),
('Heather Grey', './img/product/04_Classic_Organic_Tee-T-shirt-CS1001-Heather_Grey_7dcba8c0-49d7-4d02-b083-fd6c2bd98084.jpg', 1),
('Tropical Sea', './img/product/05_CS1001_Male_ClassicOrganicTee-TropicalSea_1.jpg', 1),
('Lava Grey', './img/product/06_Classic_Organic_Tee-T-shirt-CS1001-Lava_Grey.jpg', 1),
('Navy Blue', './img/product/07_Classic_Organic_Tee-T-shirt-CS1001-Navy_Blue_9093a495-e0c6-4a72-9e62-d3ccac6c25a4.jpg', 1),
('Midnight Forest', './img/product/08_CS1001_Male_ClassicOrganicTee-MidnightForest_1.jpg', 1),
('Faded Black', './img/product/09_Classic_Organic_Tee-T-shirt-CS1001-Faded_Black_58fa2f26-4a24-44a2-8682-c3ed7c9fd90c.jpg', 1),
('Snow Melange', './img/product/10_Classic_Organic_Tee-T-shirt-CS1001-Snow_Melange.jpg', 1),
('Purple Jade', './img/product/11_CS1001-PurpleJade.jpg', 1),
('Hunter Green', './img/product/12_Classic_Organic_Tee-T-shirt-CS1001-Hunter_Green_6cef1614-0c55-49d0-a3fd-4c54c810f804.jpg', 1),
('Misty Brown', './img/product/13_CS1001_Male_ClassicOrganicTee-MistyBrown_1.jpg', 1),
('Dusty Olive', './img/product/14_Classic_Organic_Tee-T-shirt-CS1001-Dusty_Olive.jpg', 1),
('Ivory White', './img/product/15_Classic_Organic_Tee-T-shirt-CS1001-Ivory_White.jpg', 1),
('Petrol Blue', './img/product/16_Classic_Organic_Tee-T-shirt-CS1001-Petrol_Blue.jpg', 1),
('Pine Green', './img/product/17_Classic_Organic_Tee-T-shirt-CS1001-Pine_Green_d48829e7-4b59-45cf-8c81-43cea67c941b.jpg', 1),
('Burned Yellow', './img/product/18_Classic_Organic_Tee-T-shirt-CS1001-Burned_Yellow.jpg', 1);

-- Insert product colors for Hoodie
INSERT INTO product_colors (name, image, product_id) VALUES
('Deep Black', './img/product/04_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Deep_Black.jpg', 2),
('Heather Grey', './img/product/02_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Heather_Grey.jpg', 2),
('Ivory White', './img/product/03_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Ivory_White_0097114e-8002-4bc2-a1f6-223908dbdcf4.jpg', 2),
('Raspberry Pink', './img/product/05_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Raspberry_Pink.jpg', 2),
('Purple Jade', './img/product/06_CS1015-PurpleJade_b6677a3c-def4-4851-a2b2-c14202412472.jpg', 2),
('Navy Blue', './img/product/07_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Navy_Blue.jpg', 2),
('Limestone Grey', './img/product/08_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Limestone_Grey.jpg', 2),
('Sahara Camel', './img/product/09_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Sahara_Camel.jpg', 2),
('Faded Black', './img/product/11_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Faded_Black_038b5d69-e5f8-4c19-8f3b-612b4492157e.jpg', 2),
('Snow Melange', './img/product/12_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Snow_Melange.jpg', 2),
('Sandstone Orange', './img/product/14_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Sandstone_Orange_b7023bda-926e-4a54-9223-b63c3b24f6d4.jpg', 2),
('Coffee Brown', './img/product/15_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Coffee_Brown_5a07b23c-30a0-48ff-b1d7-613a2c56a08c.jpg', 2),
('Sapphire Blue', './img/product/01_CS1015_Female_OrganicOversizedHood-SapphireBlue_1.jpg', 2);

-- Insert product colors for Classic Mug
INSERT INTO product_colors (name, image, product_id) VALUES
('White', './img/product/Ceramic-Coffee-Mug.jpg', 3),
('Black', './img/product/Ceramic-Coffee-Mug-B.jpg', 3);

-- Insert product colors for Oversized Crew
INSERT INTO product_colors (name, image, product_id) VALUES
('Soft Lavender', './img/product/01_Organic_Oversized_Crew-Oversized_Crew-CS1012-Soft_Lavender.jpg', 5),
('Sunny Orange', './img/product/03_Organic_Oversized_Crew-Oversized_Crew-CS1012-Sunny_Orange.jpg', 5),
('Deep Black', './img/product/10_Organic_Oversized_Crew-Oversized_Crew-CS1012-Deep_Black.jpg', 5);

-- Insert product colors for Sweatpants
INSERT INTO product_colors (name, image, product_id) VALUES
('Oyster Grey', './img/product/01_Organic_Sweatpants-Pants-CS1011-Oyster_Grey_6e5b059a-26a1-41b8-a848-fecfbfb9d48f.jpg', 6),
('Soft Lavender', './img/product/02_Organic_Sweatpants-Pants-CS1011-Soft_Lavender.jpg', 6),
('Teal Blue', './img/product/03_Organic_Sweatpants-Pants-CS1011-Teal_Blue.jpg', 6),
('Raspberry Pink', './img/product/04_Organic_Sweatpants-Pants-CS1011-Raspberry_Pink_79d3eb82-9181-4cb3-9a35-93757ae45f82.jpg', 6),
('Heather Grey', './img/product/05_Organic_Sweatpants-Pants-CS1011-Heather_Grey_25305df8-8a44-4db2-ad54-601f8f43c47a.jpg', 6),
('Neptune Blue', './img/product/06_CS1011_Female_OrganicSweatpants-NeptuneBlue_1.jpg', 6),
('Snow Melange', './img/product/07_Organic_Sweatpants-Pants-CS1011-Snow_Melange_6505a777-7fb8-43fd-b7c9-43c8df788fee.jpg', 6),
('Warm Taupe', './img/product/08_Organic_Sweatpants-Pants-CS1011-Warm_Taupe_3fe1e664-0515-47f0-95c2-47122367cbf4.jpg', 6),
('Deep Black', './img/product/09_Organic_Sweatpants-Pants-CS1011-Deep_Black_0e8fddc0-e17d-4780-877c-c1005e600f06.jpg', 6),
('Ivory White', './img/product/10_Organic_Sweatpants-Pants-CS1011-Ivory_White_003e9c65-f77d-44a3-bf37-81ad760e9e16.jpg', 6),
('Lava Grey', './img/product/11_Organic_Sweatpants-Pants-CS1011-Lava_Grey_9f451e36-86db-4ff2-95cc-d1d0f8bf2511.jpg', 6),
('Navy Blue', './img/product/12_Organic_Sweatpants-Pants-CS1011-Navy_Blue_ab4b1a36-2d66-4ac0-b030-f82fd7fde203.jpg', 6),
('Pearly Purple', './img/product/13_Organic_Sweatpants-Pants-CS1011-Pearly_Purple.jpg', 6),
('Spring Green', './img/product/14_Organic_Sweatpants-Pants-CS1011-Spring_Green.jpg', 6),
('Faded Black', './img/product/15_Organic_Sweatpants-Pants-CS1011-Faded_Black_e542a3c6-669b-4737-84ba-429f8a702edb.jpg', 6);

-- Insert product colors for Wool Hat
INSERT INTO product_colors (name, image, product_id) VALUES
('Scarlet Red', './img/product/04_Merino_Wool_Hat-Hat-CS5085-Scarlet_Red_01df4d62-f2e6-4fed-b0ae-231ad1fa657d.jpg', 7),
('Oxblood Red', './img/product/01_Merino_Wool_Hat-Hat-CS5085-Oxblood_Red_ec3487a7-de65-4776-b965-e5b15c507807.jpg', 7),
('Purple Haze', './img/product/03_Merino_Wool_Hat-Hat-CS5085-Purple_Haze_9de2786f-8537-4000-86c8-ec842d27e26e.jpg', 7),
('Deep Black', './img/product/05_Merino_Wool_Hat-Hat-CS5085-Deep_Black.jpg', 7),
('Dusty Olive', './img/product/06_Merino_Wool_Hat-Hat-CS5085-Dusty_Olive_f4ba4429-ec0a-4118-9ca2-3e2030f46471.jpg', 7),
('Pacific Blue', './img/product/07_Merino_Wool_Hat-Hat-CS5085-Pacific_Blue_117009f5-5bfc-40a3-8000-aec9ac771a5e.jpg', 7),
('Stone Blue', './img/product/08_Merino_Wool_Hat-Hat-CS5085-Stone_Blue_172b3e9f-9a8e-449a-b55c-ea1669f5e7da.jpg', 7),
('Heather Grey', './img/product/09_Merino_Wool_Hat-Hat-CS5085-Heather_Grey.jpg', 7),
('Lava Grey', './img/product/10_Merino_Wool_Hat-Hat-CS5085-Lava_Grey.jpg', 7),
('Ocean Green', './img/product/11_Merino_Wool_Hat-Hat-CS5085-Ocean_Green_c6fe7f57-1b0c-4bbf-a9b1-5a0eb6442a86.jpg', 7),
('Soft Lavender', './img/product/12_Merino_Wool_Hat-Hat-CS5085-Soft_Lavender_631a321d-3bd8-4c3a-af85-9b2fad13e702.jpg', 7),
('Limestone Grey', './img/product/13_Merino_Wool_Hat-Hat-CS5085-Limestone_Grey_61bcb6c2-1632-42fc-9e2f-b4fa55e874fe.jpg', 7),
('Hunter Green', './img/product/14_Merino_Wool_Hat-Hat-CS5085-Hunter_Green_50453e7d-df0a-42dc-90f5-6380895b8906.jpg', 7),
('Warm Taupe', './img/product/15_Merino_Wool_Hat-Hat-CS5085-Warm_Taupe.jpg', 7),
('Navy Blue', './img/product/16_Merino_Wool_Hat-Hat-CS5085-Navy_Blue.jpg', 7);
