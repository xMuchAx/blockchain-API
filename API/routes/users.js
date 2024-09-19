import express from "express";
import {
    addCatToken,
    burnableCatToken,
    getCatTokenQuantity,
    transferCatToken
} from "../../contract_service/cat_contract.js"

const router = express.Router();

const POLYGON_SERVER = "https://rpc-amoy.polygon.technology/";
const CAT_TOKEN_0 = 0;

//route to get all user info (ca recup que les token pour l'instant)
router.get("/:tokenAccount", async (req, res) => {
    try {
        const AccountTokenQty = await getCatTokenQuantity(POLYGON_SERVER, req.params.tokenAccount, CAT_TOKEN_0);

        res.status(200).json({
            Account: `this account contain: ${AccountTokenQty}`,

        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get("/addToken/:tokenAccount", async (req, res, tokenQty) => {
    try {
        await addCatToken(POLYGON_SERVER, PRIVATE_KEY, req.params.tokenAccount, CAT_TOKEN_0, 10n);
        const AccountTokenQty = await getCatTokenQuantity(POLYGON_SERVER, req.params.tokenAccount, CAT_TOKEN_0);


        res.status(200).json({
            Account: `this account contain: ${AccountTokenQty}`,

        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get("/removeToken/:tokenAccount", async (req, res) => {
    try {
        await burnableCatToken(POLYGON_SERVER, PRIVATE_KEY, req.params.tokenAccount, CAT_TOKEN_0, 10n);
        const AccountTokenQty = await getCatTokenQuantity(POLYGON_SERVER, req.params.tokenAccount, CAT_TOKEN_0);


        res.status(200).json({
            Account: `This account contains: ${AccountTokenQty}`,

        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            details: "An error occurred while removing tokens or fetching the account balance."
        });
    }
});

router.post("/transferToken", async (req, res) => {
    try {
        const {tokenPrivateAccount, tokenAccountFrom, tokenAccountTo, tokenQty} = req.body;

        // Vérification que les paramètres requis sont bien présents
        if (!tokenPrivateAccount || !tokenAccountFrom || !tokenAccountTo || !tokenQty) {
            return res.status(400).json({
                error: "Missing required parameters: tokenPrivateAccount, tokenAccountFrom, tokenAccountTo, tokenQty"
            });
        }

        // Vérification que tokenQty est un nombre
        if (isNaN(tokenQty)) {
            return res.status(400).json({
                error: "Invalid token quantity. It must be a valid number."
            });
        }

        // Effectuer le transfert
        await transferCatToken(
            POLYGON_SERVER,
            tokenPrivateAccount,
            tokenAccountFrom,
            tokenAccountTo,
            CAT_TOKEN_0,
            tokenQty
        );

        // Réponse en cas de succès
        res.status(200).json({
            message: `Successfully transferred ${tokenQty} tokens from ${tokenAccountFrom} to ${tokenAccountTo}`
        });

    } catch (error) {
        // Gestion des erreurs
        res.status(500).json({
            error: error.message,
            details: "An error occurred while transferring tokens."
        });
    }
});


export default router;


