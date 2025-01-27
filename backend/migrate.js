const fs = require('fs');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

async function runMigration() {
    try {
        // Read the migration file
        const migration = fs.readFileSync(
            path.join(__dirname, 'migrations', 'create_products_table.sql'),
            'utf8'
        );

        // Run the migration
        await pool.query(migration);
        console.log('Migration completed successfully');

        // Insert some sample products
        await pool.query(`
            INSERT INTO products (name, description, price, category, image)
            VALUES 
            ('Custom T-Shirt', 'High-quality cotton t-shirt for custom printing', 29.99, 'Clothing', '/img/products/tshirt.jpg'),
            ('Custom Mug', 'Ceramic mug perfect for personalized designs', 14.99, 'Mugs', '/img/products/mug.jpg'),
            ('Hoodie', 'Warm and comfortable hoodie for custom designs', 49.99, 'Clothing', '/img/products/hoodie.jpg')
            ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);
        `);
        console.log('Sample products inserted successfully');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

runMigration();
