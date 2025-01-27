-- Create database
CREATE DATABASE IF NOT EXISTS imprimini;
USE imprimini;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    work TEXT
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    color_id INTEGER,
    size_id INTEGER,
    category_id INTEGER,
    description TEXT,
    image_url TEXT,
    FOREIGN KEY (color_id) REFERENCES product_colors(id),
    FOREIGN KEY (size_id) REFERENCES product_sizes(id),
    FOREIGN KEY (category_id) REFERENCES product_categories(id)
);

-- Create product_colors table
CREATE TABLE IF NOT EXISTS product_colors (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    hex_code TEXT NOT NULL
);

-- Create product_sizes table
CREATE TABLE IF NOT EXISTS product_sizes (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    dimensions TEXT
);

-- Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert admin user (password: Admin@123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@imprimini.com', '$2a$10$XFE/UQEe6c5gXK5N6Q5kCOYz6TtxMQJqhN.yFEGXCvQyYhP.Gkzty', 'admin');

-- Insert some sample products
INSERT INTO products (name, price, stock) VALUES 
('Business Cards', 29.99, 1000),
('Flyers', 49.99, 500),
('Brochures', 79.99, 300),
('Posters', 39.99, 200);
