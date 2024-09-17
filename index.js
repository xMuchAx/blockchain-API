const express = require("express");
const port = process.env.PORT || 3000;
const app = express();


app.get("/", (req, res) => {
  res.send("Hello World!");
});

const users = require("./routes/users")

app.use("/users", users)

app.listen(port, () => {
  console.log(`Serveur is online on port ${port}`);
});
