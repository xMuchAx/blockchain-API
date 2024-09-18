import express from "express";
const port = process.env.PORT || 3003;
export const contract_adress = process.env.CONTRACT_ADRESS || '0x3111BaeECB3a4465D3Ba0Cae67097fC326Cb5860';  
const app = express();
import users from "./routes/users.js"; 
import dotenv from 'dotenv';
dotenv.config();
console.log("Adresse du contrat :", contract_adress);  

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World2222!");
});

app.use("/users", users)

app.listen(port, () => {
  console.log(`Serveur is online on port ${port}`);
});
