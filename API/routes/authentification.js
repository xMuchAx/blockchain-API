import express from "express";
const router = express.Router();
import { pool } from "../../database.js"; // Importing the database connection pool
import bcrypt from "bcrypt"; // Importing bcrypt for password hashing
import jwt from 'jsonwebtoken'; // Importing jsonwebtoken for JWT handling
import authenticateToken from "../../middleware/authenticateToken.js";
const SECRET_KEY = 'blockchain-jwt-key'; // Secret key used for signing JWTs


/**
 * @swagger
 * /authentification/getAllUsers:
 *   get:
 *     summary: Retrieve all users
 *     description: Retrieve a list of all users from the database.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       public_address:
 *                         type: string
 *                       private_key:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
// Route to get all users from database
router.get("/getAllUsers", authenticateToken , async (req, res) => {
  
  try {
    // get all users from the database
    const result = await pool.query(
      'SELECT * FROM users',
    );

    res.status(200).json({users: result.rows})
  } catch (error) {
    //Errors during fetch users
    res.status(500).json({ error: "Errors during fetch users" });
  }

});


/**
 * @swagger
 * /authentification/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user in the database. Checks if the email is already in use, and if not, hashes the password and stores the user in the database. A JWT token is generated upon successful registration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user.
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 description: The email for the new user.
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *                 example: "P@ssw0rd!"
 *               public_address:
 *                 type: string
 *                 description: The public address for the user's account.
 *                 example: "0x1234567890abcdef1234567890abcdef12345678"
 *               private_key:
 *                 type: string
 *                 description: The private key for the user's account.
 *                 example: "0xabcdef1234567890abcdef1234567890abcdef12"
 *     responses:
 *       200:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User successfully created"
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: "john_doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                 token:
 *                   type: string
 *                   description: JWT token for the newly registered user.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Email is already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "This email is already in use."
 *       500:
 *         description: Server error during registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Errors during registration"
 */
// Route to register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, public_address, private_key } = req.body;

    // Check if the user already exists in the database
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "This email is already in use." });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database with the hashed password
    await pool.query(
      "INSERT INTO users (username, email, password, public_address, private_key) VALUES ($1, $2, $3, $4, $5)",
      [username, email, hashedPassword, public_address, private_key]
    );

    const userCreated = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, hashedPassword]
    );

    if (userCreated.rows.length > 0) {
      // Generate a JWT token if the register is successful
      const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
    
      // Send a success response
      res.status(200).json({
        message: "User successfully created",
        user: userCreated.rows[0],
        token: token
      });
    }

  } catch (error) {
    // Errors during registration
    res.status(500).json({ error: "Errors during registration" });
  }
});

/**
 * @swagger
 * /authentification/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user by checking the username and password in the database. If successful, generates a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The username for the user.
 *                 example: "john@example.org"
 *               password:
 *                 type: string
 *                 description: The password for the user.
 *                 example: "P@ssw0rd!"
 *     responses:
 *       200:
 *         description: Successfully authenticated user and generated token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: "john_doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated user.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Incorrect username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Incorrect username or password"
 *       500:
 *         description: Server error during login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Errors during login"
 */
// Route to login a user
router.post('/login', async (req, res) => {

  const { email, password } = req.body;

  try {
    // Check if the email and password match in the database
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const checkPass = await bcrypt.compare(password, result.rows[0].password);
    if (result.rows.length > 0 && checkPass) {
        // Generate a JWT token if the login is successful
        const token = jwt.sign({ email: email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({
          user: result.rows[0],
          token: token
        });
    } else {
      // Send an error response if the email or password is incorrect
      res.status(401).json({ error: 'Incorrect email or password' });
    }
  } catch (error) {
    // Errors during login
    res.status(500).json({ error: "Errors during login" });
  }
});

export default router;
