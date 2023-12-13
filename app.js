const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const { body, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose();
const ShieldSentry = require('shieldsentry');
const sentry = new ShieldSentry();

// Initialize the database
const db = new sqlite3.Database('users.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the users.db database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            // Check if admin user exists and add if not
            db.get("SELECT * FROM users WHERE username = 'admin'", function(err, row) {
                if (!row) {
                    db.run("INSERT INTO users (username, password) VALUES ('admin', 'adminpass')");
                }
            });
        }
    });
}

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/vulnerable", function (req, res) {
    res.render("vulnerable");
});

app.get("/validator", function (req, res) {
    res.render("validator");
});

app.post("/", function (req, res) {
    var { username, password } = req.body;

    // Sanitize inputs using ShieldSentry
    username = sentry.sqlEscape(username);
    password = sentry.sqlEscape(password);

    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    db.get(query, (err, user) => {
        if (err) {
            let message = "Failed to log in!";
            res.render("index", { message: message });
        }
        if (user) {
            let message = "Logged in successfully!";
            res.render("index", { message: message });
        } else {
            let message = "Failed to log in!";
            res.render("index", { message: message });
        }
    });
});

app.post("/vulnerable", function (req, res) {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    db.get(query, (err, user) => {
        if (err) {
            let message = "Failed to log in!";
            res.render("vulnerable", { message: message });
        }
        if (user) {
            let message = "Logged in successfully!";
            res.render("vulnerable", { message: message });
        } else {
            let message = "Failed to log in!";
            res.render("vulnerable", { message: message });
        }
    });
});

app.post("/validator", 
    // Validation and sanitization middleware
    body('username').trim().escape(),
    body('password').trim().escape(),
    function (req, res) {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("validator", { message: "Invalid input" });
        }

        const { username, password } = req.body;
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

        db.get(query, (err, user) => {
            if (err) {
                let message = "Failed to log in!";
                res.render("validator", { message: message });
            }
            if (user) {
                let message = "Logged in successfully!";
                res.render("validator", { message: message });
            } else {
                let message = "Failed to log in!";
                res.render("validator", { message: message });
            }
        });
    }
);

app.listen(3000, function () {
    console.log('Server running on port 3000');
});