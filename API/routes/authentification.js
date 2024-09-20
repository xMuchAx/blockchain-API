import express from "express";
const router = express.Router();
import { getCatTokenQuantity } from "../../contract_service/cat_contract.js";
const POLYGON_SERVER = "https://rpc-amoy.polygon.technology/";
const CAT_TOKEN_0 = 0;
import {pool} from "../../database.js"
import bcrypt from "bcrypt"; // Importing bcrypt for password hashing
import jwt from 'jsonwebtoken'; // Importing jsonwebtoken for JWT handling
const SECRET_KEY = 'blockchain-jwt-key'; // Secret key used for signing JWTs

// Route to get the token quantity for a specific account
router.get("/:tokenAccount", async (req, res) => {
  try {
    // Call the function to get the token quantity on the Polygon network
    const AccountTokenQty = await getCatTokenQuantity(
      POLYGON_SERVER,
      req.params.tokenAccount,
      CAT_TOKEN_0
    );

    // Send a success response with the token quantity
    res.status(200).json({
      Account: `this account contains: ${AccountTokenQty}`,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
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
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});



// Route to login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the username and password match in the database
      const result = await pool.query(
        'SELECT * FROM users WHERE username = $1 AND password = $2',
        [req.params.username, req.params.mdp]
      );
  
      if (result.rows.length > 0) {
        // Generate a JWT token if the login is successful
        const token = jwt.sign({ username: req.params.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
      } else {
        // Send an error response if the username or password is incorrect
        res.status(401).json({ message: 'Incorrect username or password' });
      }
    } catch (error) {
      // Handle errors during login
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error' });
    }
});


// Route pour supprimer les tokens après récupération
router.get("/deleteTokens/:tokenAccount/:tokenPrivate", async (req, res) => {
    try {
      //récupérer la quantité de token du user depuis la blockchain
      const AccountTokenQty = await getCatTokenQuantity(
        POLYGON_SERVER,
        req.params.tokenAccount,
        CAT_TOKEN_0
      );
      if (AccountTokenQty > 0) {
        await burnableCatToken(
          POLYGON_SERVER,
          req.params.tokenPrivate,
          req.params.tokenAccount,
          CAT_TOKEN_0,
          10
        );  
        //si token brulé alors renvoyer un status 200
        res.status(200).json({
          message: "Les ${AccountTokenQty} token ont été supprimer avec succès du compte ${req.params.tokenAccount}.",
        });
      } else {
        // sinon renvoyer erreur
        res.status(400).json({
          message: "Aucun token dispo.",
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;

