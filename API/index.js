import express from "express";
const port = process.env.PORT || 3000;
export const contract_adress = process.env.CONTRACT_ADRESS || "0x3111BaeECB3a4465D3Ba0Cae67097fC326Cb5860";
const app = express();
import users from "./routes/users.js"; 


app.get("/", (req, res) => {
  res.send("Hello World2222!");
});


app.use("/users", users)

app.listen(port, () => {
  console.log(`Serveur is online on port ${port}`);
});
