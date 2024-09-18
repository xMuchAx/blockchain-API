import express from "express";
const router = express.Router();
import { getCatTokenQuantity } from "../../contract_service/cat_contract.js";
const POLYGON_SERVER = "https://rpc-amoy.polygon.technology/";
const CAT_TOKEN_0 = 0;
import { pool } from "./database.js";
import bcrypt from "bcrypt";

// route to get all user info (ca recup que les token pour l'instant)
router.get("/:tokenAccount", async (req, res) => {
  try {
    const AccountTokenQty = await getCatTokenQuantity(
      POLYGON_SERVER,
      req.params.tokenAccount,
      CAT_TOKEN_0
    );

    res.status(200).json({
      Account: `this account contain: ${AccountTokenQty}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour l'inscription d'un utilisateur
router.get("/register/:username/:email/:password", async (req, res) => {
  try {
    // const { username, email, password } = req.body;
    const email = req.params.email;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await pool.query(
      "SELECT * FROM cat_users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.params.password, salt);

    // Création du nouvel utilisateur
    const newUser = await pool.query(
      "INSERT INTO cat_users (username, email, password,public_address,private_key) VALUES ($1, $2, $3,'','')",
      [req.params.username, req.params.email, hashedPassword]
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'inscription de l'utilisateur" });
  }
});

router.get("/login/:username", async (req, res) => {
  const result = await pool.query(
    `SELECT * from cat_users where username = '${req.params.username}'`
  );
  res.status(200).json(result.rows);
});

export default router;
