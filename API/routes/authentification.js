import express from "express";
const router = express.Router();
import { pool } from "../../database.js"; // Importing the database connection pool
import bcrypt from "bcrypt"; // Importing bcrypt for password hashing
import jwt from 'jsonwebtoken'; // Importing jsonwebtoken for JWT handling
const SECRET_KEY = 'blockchain-jwt-key'; // Secret key used for signing JWTs

// Route to get all users from database
router.get("/getAllUsers", async (req, res) => {
  
  try {
    // get all users from the database
    const result = await pool.query(
      'SELECT * FROM users',
    );

    res.status(200).json({users:result.rows})
  } catch (error) {
    // Handle errors during fetch users
    res.status(500).json({ message: error.message });
  }

});

// Route to register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists in the database
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "This email is already in use." });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database with the hashed password
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password,public_address,private_key) VALUES ($1, $2, $3,'','')",
      [username, email, hashedPassword]
    );

    // Send a success response
    res.status(201).json({
      message: "User successfully created",
      user: newUser.rows[0],
    });
  } catch (error) {
    // Handle errors during registration
    res.status(500).json({ message: error.message });
  }
});

// Route to login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the username and password match in the database
      const result = await pool.query(
        'SELECT * FROM users WHERE username = $1 AND password = $2',
        [username, password]
      );
  
      if (result.rows.length > 0) {
        // Generate a JWT token if the login is successful
        const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({
          user: result.rows[0],
          token: token
        });
        } else {
        // Send an error response if the username or password is incorrect
        res.status(401).json({ message: 'Incorrect username or password' });
      }
    } catch (error) {
      // Handle errors during login
      res.status(500).json({ message: error.message });
    }
});

export default router;
