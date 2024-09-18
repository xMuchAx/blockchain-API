import express from "express";
const router = express.Router();
import {getCatTokenQuantity} from "../../contract_service/cat_contract.js"
const POLYGON_SERVER = "https://rpc-amoy.polygon.technology/";
const CAT_TOKEN_0 = 0;
import {pool} from "./database.js"
import jwt from 'jsonwebtoken';
const SECRET_KEY = 'blockchain-jwt-key '; // Utilise une clé secrète pour signer le jeton


// route to get all user info (ca recup que les token pour l'instant)
router.get("/:tokenAccount", async (req, res) => {
    console.log(POLYGON_SERVER, req.params.tokenAccount)

  try {
      const AccountTokenQty =   await getCatTokenQuantity(POLYGON_SERVER, req.params.tokenAccount, CAT_TOKEN_0);
      
      res.status(200).json({
          Account: `this account contain: ${AccountTokenQty} cat`,
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.get('/login/:username/:mdp', async (req, res) => {
    // const { username, password } = req.body;
    
    try {
      const result = await pool.query(
        'SELECT * FROM cat_users WHERE username = $1 AND password = $2',
        [req.params.username, req.params.mdp]
      );
  
      if (result.rows.length > 0) {
        // Créer un jeton JWT
        const token = jwt.sign({ username: req.params.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

export default router;


