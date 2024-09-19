import express from "express";
const port = process.env.PORT || 3000;
export const contract_adress = process.env.CONTRACT_ADRESS || "0x3111BaeECB3a4465D3Ba0Cae67097fC326Cb5860"
const app = express();
import authentification from "./routes/authentification.js"; 
import token from "./routes/token.js"

app.get("/", (req, res) => {
  res.send("Hello World Bienvenu dans l'API CAT!");
});

app.use("/authentification", authentification)

app.use("/token", token)

app.listen(port, () => {
  console.log(`Serveur is online on port ${port}`);
});
