import express from "express";
const port = process.env.PORT || 3000;
const app = express();
import users from "./routes/users.js"; 


app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use("/users", users)

app.listen(port, () => {
  console.log(`Serveur is online on port ${port}`);
});
