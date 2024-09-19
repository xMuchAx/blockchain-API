import express from "express";
const router = express.Router();
import { transferCatToken, getTokenTransfersForUser } from "../../contract_service/cat_contract.js";
const POLYGON_SERVER = "https://rpc-amoy.polygon.technology/"; // URL for the Polygon blockchain server
const CAT_TOKEN_0 = 0; // Token identifier for CAT_TOKEN
import authenticateToken from "../../middleware/authenticateToken.js";


// Route to transfer tokens between two accounts
router.post("/transferToken", authenticateToken ,async (req, res) => {
    try {
        const { tokenPrivateAccount, tokenAccountFrom, tokenAccountTo, tokenQty } = req.body;

        // Check that all required parameters are present
        if (!tokenPrivateAccount || !tokenAccountFrom || !tokenAccountTo || !tokenQty) {
            return res.status(400).json({
                error: "Missing required parameters: tokenPrivateAccount, tokenAccountFrom, tokenAccountTo, tokenQty"
            });
        }

        // Validate that tokenQty is a valid number
        if (isNaN(tokenQty)) {
            return res.status(400).json({
                error: "Invalid token quantity. It must be a valid number."
            });
        }

        // Perform the token transfer
        await transferCatToken(
            POLYGON_SERVER,
            tokenPrivateAccount,
            tokenAccountFrom,
            tokenAccountTo,
            CAT_TOKEN_0,
            tokenQty
        );

        // Respond with success if the transfer is successful
        res.status(200).json({
            message: `Successfully transferred ${tokenQty} tokens from ${tokenAccountFrom} to ${tokenAccountTo}`
        });

    } catch (error) {
        // Error occurred while transferring tokens
        res.status(500).json({
            error: "Error occurred while transferring tokens.",
        });
    }
});

// Route to add tokens to a specific account
router.post("/addToken", authenticateToken , async (req, res) => {
    const { tokenPrivateAccount, tokenAccount, tokenQty } = req.body;

    try {
        // Add tokens to the account
        await addCatToken(POLYGON_SERVER, tokenPrivateAccount, tokenAccount, CAT_TOKEN_0, tokenQty);

        res.status(200).json({
            Account: `Successfully added`,
        });
    } catch (error) {
        //Error during add token
        res.status(500).json({
            error: "Error during add token"
        });
    }
});

// Route to remove tokens from an account (burn tokens)
router.post("/removeToken", authenticateToken ,async (req, res) => {
    const { tokenPrivateAccount, tokenAccount, tokenQty } = req.body;

    try {
        // Burn tokens from the account
        await burnableCatToken(POLYGON_SERVER, tokenPrivateAccount, tokenAccount, CAT_TOKEN_0, tokenQty);

        res.status(200).json({
            Account: `Removal done successfully`,
        });
    } catch (error) {
        // Error during delete token
        res.status(500).json({
            error: "Error during delete token"
        });
    }
});

// Route to get the token transfer history for a specific account
router.get("/transactions/:tokenAccount",authenticateToken, async (req, res) => {
    try {
      const tokenAccount = req.params.tokenAccount;

      // Retrieve the transfer history for the account
      const transfers = await getTokenTransfersForUser(POLYGON_SERVER, tokenAccount);
      res.status(200).json({
        transfers: transfers,
      });
    } catch (error) {
      // Error while fetching transfers
      res.status(500).json({ error: "Error while fetching transfers" });
    }
});

export default router;
