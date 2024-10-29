const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root@123',
    database: 'fsd'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, password], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error signing up');
        }
        res.send('Signup successful!');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error logging in');
        }
        if (results.length > 0) {
            return res.send('Login successful!');
        }
        res.status(401).send('Invalid username or password');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});