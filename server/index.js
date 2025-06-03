const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const userDB = new sqlite3.Database('./users.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to User database.');
});

const productDB = new sqlite3.Database('./product.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to Product database.');
});

// Create users table if it doesn't exist
userDB.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'store-keeper'
)`);

productDB.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER,
    price REAL,
    description TEXT,
    image_url TEXT,
    sold INTEGER DEFAULT 0
  )
`);

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, password, role = 'store-keeper' } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  userDB.run(
    `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
    [username, hashed, role],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, role });
    }
  );
});

// Login endpoint
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  userDB.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
    if (err || !row) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, row.password);
    if (match) {
      res.json({ message: 'Login successful', username: row.username, role: row.role });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

app.delete('/delete-user/:username', (req, res) => {
  const { username } = req.params;

  userDB.run(`DELETE FROM users WHERE username = ?`, [username], function (err) {
    if (err) {
      console.error('Delete error:', err.message);
      return res.status(500).json({ error: 'Failed to delete user' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: `User '${username}' deleted successfully` });
  });
});



/* Products database*/



app.post('/products', (req, res) => {
  const { name, category, quantity, price, description, image_url, sold } = req.body;
  productDB.run(
    `INSERT INTO products (name, category, quantity, price, description, image_url, sold)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, category, quantity, price, description, image_url, sold],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Product added', id: this.lastID });
    }
  );
});

app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, price, description, image_url, sold } = req.body;

  productDB.run(
    `UPDATE products
     SET name = ?, category = ?, quantity = ?, price = ?, description = ?, image_url = ?, sold = ?
     WHERE id = ?`,
    [name, category, quantity, price, description, image_url, sold, id],
    function (err) {
      if (err) {
        console.error('Update error:', err.message);
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Product not found or no change detected' });
      }

      res.json({ message: 'Product updated successfully' });
    }
  );
});

app.get('/dashboard/summary', (req, res) => {
  productDB.all(`
    SELECT 
      name,
      quantity,
      sold,
      price,
      image_url,
      (sold * price) AS revenue
    FROM products
    ORDER BY sold DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const topSelling = rows.slice(0, 5);
    const topRevenue = [...rows]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    const topAvailable = [...rows]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    res.json({ topSelling, topRevenue, topAvailable });
  });
});


app.get('/products', (req, res) => {
  productDB.all(`SELECT * FROM products`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  productDB.all(`SELECT * FROM products WHERE id = ?`, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  productDB.run(`DELETE FROM products WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  });
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
