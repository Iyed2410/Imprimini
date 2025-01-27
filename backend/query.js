const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'imprimini.db');
const db = new sqlite3.Database(dbPath);

// Query all users
db.all('SELECT id, name, email, role, created_at FROM users', [], (err, rows) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    console.log('Users in database:');
    console.log('------------------');
    rows.forEach(row => {
        console.log(`ID: ${row.id}`);
        console.log(`Name: ${row.name}`);
        console.log(`Email: ${row.email}`);
        console.log(`Role: ${row.role}`);
        console.log(`Created: ${row.created_at}`);
        console.log('------------------');
    });
    db.close();
});
