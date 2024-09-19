import express from "express";
const router = express.Router();
import { transferCatToken, getTokenTransfersForUser } from "../../contract_service/cat_contract.js";
const POLYGON_SERVER = "https://rpc-amoy.polygon.technology/"; // URL for the Polygon blockchain server
const CAT_TOKEN_0 = 0; // Token identifier for CAT_TOKEN
import authenticateToken from "../../middleware/authenticateToken.js";


/**
 * @swagger
 * /token/transferToken:
 *   post:
 *     summary: Transfer tokens between two accounts
 *     description: Transfers a specified quantity of tokens from one account to another on the Polygon blockchain.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenPrivateAccount:
 *                 type: string
 *                 description: The private key of the account making the transfer.
 *                 example: "0xabc123..."
 *               tokenAccountFrom:
 *                 type: string
 *                 description: The public address of the sender's account.
 *                 example: "0xdef456..."
 *               tokenAccountTo:
 *                 type: string
 *                 description: The public address of the recipient's account.
 *                 example: "0xghi789..."
 *               tokenQty:
 *                 type: number
 *                 description: The quantity of tokens to be transferred.
 *                 example: 100
 *     responses:
 *       200:
 *         description: Tokens successfully transferred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully transferred 100 tokens from 0xdef456... to 0xghi789..."
 *       400:
 *         description: Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required parameters: tokenPrivateAccount, tokenAccountFrom, tokenAccountTo, tokenQty"
 *       500:
 *         description: Server error during token transfer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error occurred while transferring tokens."
 */

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

/**
 * @swagger
 * /token/addToken:
 *   post:
 *     summary: Add tokens to a specific account
 *     description: Adds a specified quantity of tokens to a given account on the Polygon blockchain.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenPrivateAccount:
 *                 type: string
 *                 description: The private key of the account adding the tokens.
 *                 example: "0xabc123..."
 *               tokenAccount:
 *                 type: string
 *                 description: The public address of the account to which tokens will be added.
 *                 example: "0xdef456..."
 *               tokenQty:
 *                 type: number
 *                 description: The quantity of tokens to be added.
 *                 example: 500
 *     responses:
 *       200:
 *         description: Tokens successfully added to the account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Account:
 *                   type: string
 *                   example: "Successfully added"
 *       500:
 *         description: Error during token addition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error during add token"
 */

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

/**
 * @swagger
 * /token/removeToken:
 *   post:
 *     summary: Remove tokens from a specific account (burn tokens)
 *     description: Burns a specified quantity of tokens from a given account on the Polygon blockchain.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenPrivateAccount:
 *                 type: string
 *                 description: The private key of the account removing the tokens.
 *                 example: "0xabc123..."
 *               tokenAccount:
 *                 type: string
 *                 description: The public address of the account from which tokens will be removed.
 *                 example: "0xdef456..."
 *               tokenQty:
 *                 type: number
 *                 description: The quantity of tokens to be removed (burned).
 *                 example: 300
 *     responses:
 *       200:
 *         description: Tokens successfully removed from the account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Account:
 *                   type: string
 *                   example: "Removal done successfully"
 *       500:
 *         description: Error during token removal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error during delete token"
 */

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

/**
 * @swagger
 * /token/transactions/{tokenAccount}:
 *   get:
 *     summary: Get transaction history for a token account
 *     description: Retrieves the token transfer history for a specific account on the Polygon blockchain.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tokenAccount
 *         required: true
 *         schema:
 *           type: string
 *         description: The public address of the account to retrieve transaction history for.
 *         example: "0xabc123..."
 *     responses:
 *       200:
 *         description: Successfully retrieved transaction history.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transfers:
 *                   type: array
 *                   items:
 *                     type: object
 *                   example: [
 *                     {
 *                       "from": "0xabc123...",
 *                       "to": "0xdef456...",
 *                       "amount": 100,
 *                       "timestamp": "2023-09-15T10:00:00Z"
 *                     },
 *                     {
 *                       "from": "0xdef456...",
 *                       "to": "0xghi789...",
 *                       "amount": 50,
 *                       "timestamp": "2023-09-16T12:00:00Z"
 *                     }
 *                   ]
 *       500:
 *         description: Error while fetching transfers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error while fetching transfers"
 */

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
