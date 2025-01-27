const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();

// SQLite database setup with promises
const dbPath = path.join(__dirname, 'imprimini.db');
const db = new sqlite3.Database(dbPath);

// Promisify database operations
const dbRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

const dbGet = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const dbAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Enable CORS for all routes
app.use(cors({
    origin: '*', // Be more restrictive in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 3600
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// List all registered routes
const listRoutes = () => {
    const routes = [];
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            routes.push({
                path: middleware.route.path,
                methods: Object.keys(middleware.route.methods)
            });
        }
    });
    console.log('Registered routes:', routes);
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Initialize database
async function initializeDatabase() {
    try {
        console.log('Initializing database...');

        // Create users table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                work TEXT,
                role TEXT DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created or already exists');

        // Check if admin user exists
        const adminUser = await dbGet('SELECT * FROM users WHERE email = ?', ['admin@imprimini.com']);
        
        if (!adminUser) {
            // Create admin user if not exists
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            await dbRun(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                ['Admin', 'admin@imprimini.com', hashedPassword, 'admin']
            );
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }

        // Create orders table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                total REAL NOT NULL,
                status TEXT DEFAULT 'pending',
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);
        console.log('Orders table created or already exists');

        // Create products table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                image TEXT,
                category TEXT
            )
        `);
        console.log('Products table created or already exists');

        // Create product_colors table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS product_colors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                image TEXT,
                FOREIGN KEY (product_id) REFERENCES products (id)
            )
        `);
        console.log('Product colors table created or already exists');

        // Insert test data if no products exist
        const products = await dbAll('SELECT * FROM products');
        if (products.length === 0) {
            // Insert test products
            await dbRun(`
                INSERT INTO products (name, description, price, image, category)
                VALUES 
                ('Classic Hoodie', 'Comfortable cotton hoodie with front pocket', 49.99, 'img/product/hoodie1.jpg', 'clothing'),
                ('Premium Hoodie', 'High-quality premium cotton blend hoodie', 69.99, 'img/product/hoodie2.jpg', 'clothing'),
                ('Sports Hoodie', 'Athletic performance hoodie for active lifestyle', 59.99, 'img/product/hoodie3.jpg', 'clothing')
            `);

            // Get the inserted products
            const insertedProducts = await dbAll('SELECT id FROM products');
            
            // Insert colors for each product
            for (const product of insertedProducts) {
                await dbRun(`
                    INSERT INTO product_colors (product_id, name, image)
                    VALUES 
                    (?, 'Black', 'img/colors/black.jpg'),
                    (?, 'Navy', 'img/colors/navy.jpg'),
                    (?, 'Gray', 'img/colors/gray.jpg')
                `, [product.id, product.id, product.id]);
            }
        }

        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
        process.exit(1);
    }
}

// Initialize database on startup
initializeDatabase();

// Product Routes
app.get('/api/products/search', async (req, res) => {
    try {
        const { query } = req.query;
        console.log('Received search query:', query);

        if (!query) {
            console.log('No query provided');
            return res.status(400).json({ error: 'Search query is required' });
        }

        // First get matching products
        console.log('Searching for products with query:', query);
        const products = await dbAll(`
            SELECT * FROM products
            WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
        `, [`%${query}%`, `%${query}%`, `%${query}%`]);

        console.log('Found products:', products);

        // Then get colors for each product
        console.log('Getting colors for products...');
        const productsWithColors = await Promise.all(products.map(async (product) => {
            const colors = await dbAll(`
                SELECT name, image FROM product_colors
                WHERE product_id = ?
            `, [product.id]);
            
            console.log(`Colors for product ${product.id}:`, colors);
            
            return {
                ...product,
                colors: colors || []
            };
        }));

        console.log('Final products with colors:', productsWithColors);
        res.json(productsWithColors);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Error searching products' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await dbGet(`
            SELECT p.*, GROUP_CONCAT(json_object(
                'name', pc.name,
                'image', pc.image
            )) as colors
            FROM products p
            LEFT JOIN product_colors pc ON p.id = pc.product_id
            WHERE p.id = ?
            GROUP BY p.id
        `, [id]);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Parse the colors JSON string
        const formattedProduct = {
            ...product,
            colors: product.colors ? JSON.parse(`[${product.colors}]`) : []
        };

        res.json(formattedProduct);
    } catch (error) {
        console.error('Error loading product:', error);
        res.status(500).json({ error: 'Error loading product' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        // Get all products with their colors
        const products = await dbAll(`
            SELECT p.*, GROUP_CONCAT(json_object(
                'name', pc.name,
                'image', pc.image
            )) as colors
            FROM products p
            LEFT JOIN product_colors pc ON p.id = pc.product_id
            GROUP BY p.id
        `);

        // Parse the colors JSON string for each product
        const formattedProducts = products.map(product => ({
            ...product,
            colors: product.colors ? JSON.parse(`[${product.colors}]`) : []
        }));

        res.json(formattedProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        res.status(500).json({ error: 'Error loading products' });
    }
});

// Debug route to check all products
app.get('/api/debug/products', async (req, res) => {
    try {
        const products = await dbAll('SELECT * FROM products');
        const colors = await dbAll('SELECT * FROM product_colors');
        res.json({ products, colors });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error getting products' });
    }
});

// Auth Routes
app.post('/api/auth/login', 
    async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email });

        const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
        
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log('Invalid password for user:', email);
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key-here',
            { expiresIn: '1d' }
        );

        console.log('Login successful:', { email, role: user.role });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login. Please try again.' });
    }
});

app.post('/api/auth/register', 
    async (req, res) => {
    try {
        console.log('Registration attempt:', req.body);
        
        const { name, email, password, work } = req.body;

        // Check if user already exists
        const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
        
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user with optional work field
        await dbRun(
            'INSERT INTO users (name, email, password, work, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, work || null, 'user']
        );
        
        console.log('User registered successfully:', { name, email, work });

        // Generate JWT token for the new user
        const token = jwt.sign(
            { id: await dbGet('SELECT last_insert_rowid() as id'), role: 'user' },
            process.env.JWT_SECRET || 'your-secret-key-here',
            { expiresIn: '1d' }
        );

        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: {
                id: await dbGet('SELECT last_insert_rowid() as id'),
                name,
                email,
                role: 'user'
            }
        });
    } catch (error) {
        console.error('Registration error details:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// User Routes
app.get('/api/users', async (req, res) => {
    try {
        const users = await dbAll('SELECT id, name, email, role FROM users');
        res.json(users);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Order Routes
app.get('/api/orders', async (req, res) => {
    try {
        const query = 'SELECT orders.*, users.name as customer_name FROM orders JOIN users ON orders.user_id = users.id';
        const orders = await dbAll(query);
        res.json(orders);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { total } = req.body;

        await dbRun(
            'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
            [req.body.user_id, total, 'pending']
        );

        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404s
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.url);
    res.status(404).json({ error: 'Not Found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    listRoutes();
});
