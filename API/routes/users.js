import express from "express";
const router = express.Router();
import {getCatTokenQuantity} from "../../contract_service/cat_contract.js"
const POLYGON_SERVER = "https://rpc-amoy.polygon.technology/";
const CAT_TOKEN_0 = 0;
import {pool} from "./database.js"


// route to get all user info (ca recup que les token pour l'instant)
router.get("/:tokenAccount", async (req, res) => {

  try {
      const AccountTokenQty =   await getCatTokenQuantity(POLYGON_SERVER, req.params.tokenAccount, CAT_TOKEN_0);
      
      res.status(200).json({
          Account: `this account contain: ${AccountTokenQty}`,
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.get("/login/:username", async (req, res)=>{
    const result = await pool.query(`SELECT * from cat_users where username = '${req.params.username}'`)
    res.status(200).json(result.rows)
})

export default router;


