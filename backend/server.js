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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
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
        console.log('Checking database...');
        
        // Read and execute the SQL file
        const sqlFile = await fs.readFile(path.join(__dirname, 'imprimini.db.sql'), 'utf8');
        const statements = sqlFile.split(';').filter(stmt => stmt.trim());
        
        // Start a transaction for database initialization
        await dbRun('BEGIN TRANSACTION');
        
        try {
            for (const statement of statements) {
                if (statement.trim()) {
                    await dbRun(statement);
                }
            }
            
            // Commit the transaction
            await dbRun('COMMIT');
            console.log('Database initialization completed successfully');
        } catch (error) {
            // Rollback on error
            await dbRun('ROLLBACK');
            console.error('Error during database initialization:', error);
            throw error;
        }
    } catch (error) {
        console.error('Critical database initialization error:', error);
        process.exit(1); // Exit if database initialization fails
    }
}

// Initialize database on startup
initializeDatabase().then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        listRoutes();
    });
}).catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
});

// Product Routes

// Search products (must be before other product routes)
app.get('/api/products/search', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const products = await dbAll(`
            SELECT p.*, 
                   GROUP_CONCAT(json_object(
                       'id', pc.id,
                       'name', pc.name,
                       'image', pc.image
                   )) as colors
            FROM products p
            LEFT JOIN product_colors pc ON pc.product_id = p.id
            WHERE p.name LIKE ? OR p.description LIKE ? OR p.category LIKE ?
            GROUP BY p.id
        `, [`%${query}%`, `%${query}%`, `%${query}%`]);

        // Parse the colors JSON string for each product
        const formattedProducts = products.map(product => ({
            ...product,
            colors: product.colors ? JSON.parse(`[${product.colors}]`) : []
        }));

        res.json(formattedProducts);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Error searching products' });
    }
});

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await dbAll(`
            SELECT p.*, 
                   GROUP_CONCAT(json_object(
                       'id', pc.id,
                       'name', pc.name,
                       'image', pc.image
                   )) as colors
            FROM products p
            LEFT JOIN product_colors pc ON pc.product_id = p.id
            GROUP BY p.id
        `);

        // Parse the colors JSON string for each product
        const formattedProducts = products.map(product => ({
            ...product,
            colors: product.colors ? JSON.parse(`[${product.colors}]`) : []
        }));

        res.json(formattedProducts);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Error loading products' });
    }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await dbGet(`
            SELECT p.*, 
                   GROUP_CONCAT(json_object(
                       'id', pc.id,
                       'name', pc.name,
                       'image', pc.image
                   )) as colors
            FROM products p
            LEFT JOIN product_colors pc ON pc.product_id = p.id
            WHERE p.id = ?
            GROUP BY p.id
        `, [id]);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Parse the colors JSON string
        product.colors = product.colors ? JSON.parse(`[${product.colors}]`) : [];

        res.json(product);
    } catch (error) {
        console.error('Error loading product:', error);
        res.status(500).json({ error: 'Error loading product' });
    }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock } = req.body;
        
        // First check if the product exists
        const existingProduct = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
        
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update the product
        await dbRun(`
            UPDATE products 
            SET name = ?, description = ?, price = ?, stock = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [name, description, price, stock, id]);

        // Get the updated product with its colors
        const product = await dbGet(`
            SELECT p.*, 
                   GROUP_CONCAT(json_object(
                       'id', pc.id,
                       'name', pc.name,
                       'image', pc.image
                   )) as colors
            FROM products p
            LEFT JOIN product_colors pc ON pc.product_id = p.id
            WHERE p.id = ?
            GROUP BY p.id
        `, [id]);

        // Parse the colors JSON string
        product.colors = product.colors ? JSON.parse(`[${product.colors}]`) : [];

        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });
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

// Debug route to insert test products
app.post('/api/debug/init-products', async (req, res) => {
    try {
        // Check if products exist
        const existingProducts = await dbAll('SELECT * FROM products');
        
        if (existingProducts.length === 0) {
            // Insert test products
            await dbRun(`
                INSERT INTO products (name, description, price, image, category, stock)
                VALUES 
                ('Classic Hoodie', 'Comfortable cotton hoodie with front pocket', 49.99, 'img/product/hoodie1.jpg', 'clothing', 10),
                ('Premium Hoodie', 'High-quality premium cotton blend hoodie', 69.99, 'img/product/hoodie2.jpg', 'clothing', 15),
                ('Sports Hoodie', 'Athletic performance hoodie for active lifestyle', 59.99, 'img/product/hoodie3.jpg', 'clothing', 20)
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

            res.json({ message: 'Test products inserted successfully' });
        } else {
            res.json({ message: 'Products already exist' });
        }
    } catch (error) {
        console.error('Error inserting test products:', error);
        res.status(500).json({ error: 'Error inserting test products' });
    }
});

// Import products from JSON route
app.post('/api/debug/import-json', async (req, res) => {
    try {
        // Read products from JSON file
        const productsData = require('../data/products.json');
        
        // Clear existing products and colors
        await dbRun('DELETE FROM product_colors');
        await dbRun('DELETE FROM products');
        
        // Reset auto-increment
        await dbRun('DELETE FROM sqlite_sequence WHERE name="products" OR name="product_colors"');
        
        // Insert each product
        for (const product of productsData.products) {
            const result = await dbRun(`
                INSERT INTO products (id, name, description, price, image, category, stock)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [product.id, product.name, product.description, product.price, product.image, product.category, product.stock || 0]);
            
            // Insert colors if they exist
            if (product.colors && product.colors.length > 0) {
                for (const color of product.colors) {
                    await dbRun(`
                        INSERT INTO product_colors (product_id, name, image)
                        VALUES (?, ?, ?)
                    `, [product.id, color.name, color.image]);
                }
            }
        }
        
        res.json({ message: 'Products imported successfully from JSON' });
    } catch (error) {
        console.error('Error importing products from JSON:', error);
        res.status(500).json({ error: 'Error importing products: ' + error.message });
    }
});

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email });

        const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
        
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            'your-secret-key',
            { expiresIn: '24h' }
        );

        console.log('Login successful:', { email, role: user.role });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.username,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login. Please try again.' });
    }
});

// User registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if email already exists
        const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Check if username already exists
        const existingUsername = await dbGet('SELECT * FROM users WHERE username = ?', [name]);
        if (existingUsername) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Start transaction
        await dbRun('BEGIN TRANSACTION');

        try {
            // Insert new user
            const result = await dbRun(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, 'user']
            );

            // Create default settings for the user
            await dbRun(`
                INSERT INTO user_settings (user_id, full_name) 
                VALUES (?, ?)
            `, [result.lastID, name]);

            // Commit transaction
            await dbRun('COMMIT');

            console.log('User registered successfully:', { username: name, email });

            // Create JWT token
            const token = jwt.sign(
                { id: result.lastID, role: 'user' },
                'your-secret-key',
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: {
                    id: result.lastID,
                    username: name,
                    email,
                    role: 'user'
                }
            });
        } catch (error) {
            await dbRun('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Registration error details:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// User Routes
app.get('/api/users', async (req, res) => {
    try {
        const users = await dbAll(`
            SELECT 
                id,
                username as name,
                username,
                email,
                role,
                created_at
            FROM users
        `);
        res.json(users);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Error loading users' });
    }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role } = req.body;

        // Check if user exists
        const existingUser = await dbGet('SELECT * FROM users WHERE id = ?', [id]);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if email is already taken by another user
        const emailUser = await dbGet('SELECT * FROM users WHERE email = ? AND id != ?', [email, id]);
        if (emailUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Update user
        await dbRun(`
            UPDATE users 
            SET username = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [username, email, role, id]);

        // Get updated user
        const updatedUser = await dbGet(`
            SELECT id, username, email, role, created_at
            FROM users
            WHERE id = ?
        `, [id]);

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const user = await dbGet('SELECT * FROM users WHERE id = ?', [id]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent deletion of admin user
        if (user.role === 'admin') {
            return res.status(403).json({ error: 'Cannot delete admin user' });
        }

        // Start a transaction to ensure all deletions are successful
        await dbRun('BEGIN TRANSACTION');

        try {
            // Delete user's orders
            await dbRun('DELETE FROM orders WHERE user_id = ?', [id]);
            
            // Delete the user
            await dbRun('DELETE FROM users WHERE id = ?', [id]);
            
            // Commit the transaction
            await dbRun('COMMIT');
            
            console.log('User and associated data deleted successfully:', id);
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            // If there's an error, rollback the transaction
            await dbRun('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// Order Routes
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await dbAll(`
            SELECT o.*, 
                   u.username as user_name,
                   p.name as product_name
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            LEFT JOIN products p ON o.product_id = p.id
        `);
        res.json(orders);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Error loading orders' });
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

// User settings routes
app.get('/api/users/:id/settings', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get user settings
        const settings = await dbGet(`
            SELECT * FROM user_settings WHERE user_id = ?
        `, [id]);

        if (!settings) {
            // Create default settings if they don't exist
            await dbRun(`
                INSERT INTO user_settings (user_id) VALUES (?)
            `, [id]);
            
            // Get the newly created settings
            const newSettings = await dbGet(`
                SELECT * FROM user_settings WHERE user_id = ?
            `, [id]);
            
            return res.json(newSettings);
        }

        res.json(settings);
    } catch (error) {
        console.error('Error getting user settings:', error);
        res.status(500).json({ error: 'Error getting user settings' });
    }
});

app.put('/api/users/:id/settings', express.json({limit: '50mb'}), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            full_name,
            phone,
            bio,
            avatar_url,
            dark_mode,
            language,
            timezone,
            email_notifications,
            order_updates,
            promotional_emails,
            newsletter
        } = req.body;

        // Check if settings exist
        const existingSettings = await dbGet('SELECT * FROM user_settings WHERE user_id = ?', [id]);

        // Handle avatar_url
        let processedAvatarUrl = avatar_url;
        if (avatar_url && avatar_url.startsWith('data:image')) {
            try {
                // Extract file extension from mime type
                const mimeType = avatar_url.split(';')[0].split(':')[1];
                const fileExt = mimeType.split('/')[1];
                
                // Create a unique filename
                const fileName = `avatar_${id}_${Date.now()}.${fileExt}`;
                const filePath = path.join(__dirname, '..', 'uploads', 'avatars', fileName);
                
                // Ensure uploads directory exists
                await fs.mkdir(path.join(__dirname, '..', 'uploads', 'avatars'), { recursive: true });
                
                // Convert base64 to buffer and save
                const base64Data = avatar_url.split(',')[1];
                await fs.writeFile(filePath, base64Data, 'base64');
                
                // Update avatar_url to file path
                processedAvatarUrl = `/uploads/avatars/${fileName}`;
            } catch (error) {
                console.error('Error processing avatar:', error);
                return res.status(500).json({ error: 'Error processing avatar image' });
            }
        }

        if (!existingSettings) {
            // Create new settings
            await dbRun(`
                INSERT INTO user_settings (
                    user_id, full_name, phone, bio, avatar_url, dark_mode, language,
                    timezone, email_notifications, order_updates, promotional_emails, newsletter
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [id, full_name, phone, bio, processedAvatarUrl, dark_mode, language,
                timezone, email_notifications, order_updates, promotional_emails, newsletter]);
        } else {
            // If there's a new avatar, delete the old one
            if (processedAvatarUrl && existingSettings.avatar_url && existingSettings.avatar_url.startsWith('/uploads/avatars/')) {
                const oldFilePath = path.join(__dirname, '..', existingSettings.avatar_url);
                try {
                    await fs.unlink(oldFilePath);
                } catch (error) {
                    console.error('Error deleting old avatar:', error);
                }
            }

            // Update existing settings
            await dbRun(`
                UPDATE user_settings SET
                    full_name = ?,
                    phone = ?,
                    bio = ?,
                    avatar_url = COALESCE(?, avatar_url),
                    dark_mode = ?,
                    language = ?,
                    timezone = ?,
                    email_notifications = ?,
                    order_updates = ?,
                    promotional_emails = ?,
                    newsletter = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            `, [full_name, phone, bio, processedAvatarUrl, dark_mode, language,
                timezone, email_notifications, order_updates, promotional_emails, newsletter, id]);
        }

        // Get updated settings
        const updatedSettings = await dbGet('SELECT * FROM user_settings WHERE user_id = ?', [id]);
        res.json(updatedSettings);
    } catch (error) {
        console.error('Error updating user settings:', error);
        res.status(500).json({ error: 'Error updating user settings' });
    }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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
