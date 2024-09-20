import express from "express";
const router = express.Router();
import { transferCatToken,addCatToken, burnableCatToken, getTokenTransfersForUser, getCatTokenQuantity } from "../../contract_service/cat_contract.js";
const POLYGON_SERVER = "https://rpc-amoy.polygon.technology/"; // URL for the Polygon blockchain server
const CAT_TOKEN_0 = 0; // Token identifier for CAT_TOKEN
import authenticateToken from "../../middleware/authenticateToken.js";


/**
 * @swagger
 * /token/transferToken:
 *   post:
 *     summary: Transfer tokens between accounts
 *     description: Transfers a specified quantity of tokens from one account to another using the provided private account and addresses.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenPrivateAccount:
 *                 type: string
 *                 description: The private account used for the token transfer.
 *                 example: "0x12345abcde..."
 *               tokenAccountFrom:
 *                 type: string
 *                 description: The account from which tokens are transferred.
 *                 example: "0xabcde12345..."
 *               tokenAccountTo:
 *                 type: string
 *                 description: The account to which tokens are transferred.
 *                 example: "0x54321edcba..."
 *               tokenQty:
 *                 type: number
 *                 description: The quantity of tokens to transfer.
 *                 example: 10
 *     responses:
 *       200:
 *         description: Successfully transferred tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully transferred 10 tokens from 0xabcde12345... to 0x54321edcba..."
 *       400:
 *         description: Missing required parameters or invalid token quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required parameters: tokenPrivateAccount, tokenAccountFrom, tokenAccountTo, tokenQty"
 *       500:
 *         description: Error occurred while transferring tokens
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
 *     summary: Add tokens to an account
 *     description: Adds a specified quantity of tokens to a given account using the provided private account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenPrivateAccount:
 *                 type: string
 *                 description: The private account used for adding tokens.
 *                 example: "0x12345abcde..."
 *               tokenAccount:
 *                 type: string
 *                 description: The account to which tokens will be added.
 *                 example: "0xabcde12345..."
 *               tokenQty:
 *                 type: number
 *                 description: The quantity of tokens to add.
 *                 example: 10
 *     responses:
 *       200:
 *         description: Successfully added tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Account:
 *                   type: string
 *                   example: "Successfully added"
 *       500:
 *         description: Error occurred during token addition
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
 *     summary: Remove tokens from an account
 *     description: Burns a specified quantity of tokens from a given account using the provided private account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenPrivateAccount:
 *                 type: string
 *                 description: The private account used for removing tokens.
 *                 example: "0x12345abcde..."
 *               tokenAccount:
 *                 type: string
 *                 description: The account from which tokens will be removed.
 *                 example: "0xabcde12345..."
 *               tokenQty:
 *                 type: number
 *                 description: The quantity of tokens to remove.
 *                 example: 5
 *     responses:
 *       200:
 *         description: Successfully removed tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Account:
 *                   type: string
 *                   example: "Removal done successfully"
 *       500:
 *         description: Error occurred during token removal
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
 *     summary: Retrieve transaction history for a user account
 *     description: Fetches the transfer history of a specified token account.
 *     parameters:
 *       - name: tokenAccount
 *         in: path
 *         required: true
 *         description: The account for which to retrieve transaction history.
 *         schema:
 *           type: string
 *           example: "0xabcde12345..."
 *     responses:
 *       200:
 *         description: Successfully retrieved transaction history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transfers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       from:
 *                         type: string
 *                         example: "0x12345abcde..."
 *                       to:
 *                         type: string
 *                         example: "0xabcde12345..."
 *                       quantity:
 *                         type: number
 *                         example: 5
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-20T14:28:00Z"
 *       500:
 *         description: Error occurred while fetching transfers
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

/**
 * @swagger
 * /token/getTokenOfUser/{tokenAccount}:
 *   get:
 *     summary: Retrieve token quantity for a user account
 *     description: Fetches the quantity of a specific token for the given user account.
 *     parameters:
 *       - name: tokenAccount
 *         in: path
 *         required: true
 *         description: The account for which to retrieve the token quantity.
 *         schema:
 *           type: string
 *           example: "0xabcde12345..."
 *     responses:
 *       200:
 *         description: Successfully retrieved token quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nbToken:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Error occurred while fetching token quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error to get token from user"
 */
router.get("/getTokenOfUser/:tokenAccount", authenticateToken ,async (req,res)=>{
    try{
        const nbToken = await getCatTokenQuantity(POLYGON_SERVER, req.params.tokenAccount, CAT_TOKEN_0)
        console.log("Get token of user", nbToken)
        res.status(200).json({
            nbToken: nbToken > 0 ? Number(nbToken) : 0
        })
    }catch(error){
        // Error to get token from user
        res.status(500).json({ error: "Error to get token from user" });
    }
})

export default router;
