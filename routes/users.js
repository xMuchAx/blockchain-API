const express = require("express");
const router = express.Router();
const LOCAL_GANACHE_SERVER = "http://localhost:7545";

const CAT_TOKEN_0 = 0;

const {
    getCatTokenQuantity,
} = require("../contract_service/cat_contract");
router.get("/:tokenAccount", async (req, res) => {
  try {
      // Await the promise and get the resolved values
      const AccountTokenQty =   await getCatTokenQuantity(LOCAL_GANACHE_SERVER, req.params.tokenAccount, CAT_TOKEN_0);
      
      // Respond with the quantities
      res.status(200).json({
          Account: `this account contain: ${AccountTokenQty}`,
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

module.exports = router;
