import express from "express";
const port = process.env.PORT || 3000;
export const contract_adress = process.env.CONTRACT_ADRESS
const app = express();
import users from "./routes/users.js"; 

app.get("/", (req, res) => {
  res.send("Hello World222hhh2!");
});

app.use("/users", users)

app.listen(port, () => {
  console.log(`Serveur is online on port ${port}`);
});
