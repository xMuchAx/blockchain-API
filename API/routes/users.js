import express from "express";
const router = express.Router();
import {getCatTokenQuantity} from "../../contract_service/cat_contract.js"
const POLYGON_SERVER = "https://rpc-amoy.polygon.technology/";
const CAT_TOKEN_0 = 0;
import { pool } from "../database.js";
import { getCatTokenTransfersForUser } from "../../contract_service/cat_contract.js";

//route to get all user info (ca recup que les token pour l'instant)
// router.get("/:tokenAccount", async (req, res) => {

//   try {
//       const AccountTokenQty =   await getCatTokenQuantity(POLYGON_SERVER, req.params.tokenAccount, CAT_TOKEN_0);
//       console.log(AccountTokenQty)
//       res.status(200).json({
//           Account: `this account contain: ${AccountTokenQty}`,
//       });
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });

router.post("/transfer", async (req, res) => {
    const { fromAccount, toAccount, tokenId, amount, privateKey } = req.body;
  
    try {
      await transferCatToken(
        POLYGON_SERVER,
        privateKey, 
        fromAccount,
        toAccount,
        tokenId,
        amount
      );
      res.status(200).json({ message: "Transfert réussi" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


router.get("/all", async (req, res) => {
    try {
      const result = await pool.query("SELECT * from cat_users");
      res.status(200).json({ users: result.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
router.get("/:email", async (req, res)=>{
    const result = await pool.query(`SELECT * from cat_users WHERE email = ${req.params.email}`)
    res.status(200).json({user:result.rows})
})

router.get("/transfers/:tokenAccount", async (req, res) => {
    try {
      const tokenAccount = req.params.tokenAccount;
  
      const transfers = await getCatTokenTransfersForUser(POLYGON_SERVER, tokenAccount);
      console.log("Transferts pour l'utilisateur :", tokenAccount);
      console.log(transfers);
      res.status(200).json({
        user: tokenAccount,
        transfers: transfers,
      });
    } catch (error) {
        console.error("Erreur lors de la récupération des transferts :", error);
      res.status(500).json({ error: error.message });
    }
  });

export default router;


