import express from "express";
const port = process.env.PORT || 3000;
export const contract_adress = process.env.CONTRACT_ADRESS || "0x3111BaeECB3a4465D3Ba0Cae67097fC326Cb5860"
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import authentification from "./routes/authentification.js";
import token from "./routes/token.js"

import cors from "cors"
import bodyParser from "body-parser"

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Cat API",
      description: "API pour le projet Cat",
      contact: {
        name: "Cat API"
      },
      servers: ["http://localhost:3000"]
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT" // Specify that it's a JWT token
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ["./API/routes/*.js"]
};

const specs = swaggerJsdoc(swaggerOptions);

app.options('*', cors())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/authentification", authentification)

app.use("/token", token)

app.get("/", (req, res) => {
  res.send("Hello World Bienvenu dans l'API CAT!");
});

app.listen(port, () => {
  console.log(`Serveur is online on port ${port}`);
});
