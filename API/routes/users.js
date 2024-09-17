import express from "express";
const router = express.Router();
import {getCatTokenQuantity} from "../../contract_service/cat_contract.js"
const POLYGON_SERVER = "https://rpc-amoy.polygon.technology/";
const CAT_TOKEN_0 = 0;

//route to get all user info (ca recup que les token pour l'instant)
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

export default router;


