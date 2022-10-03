import { ApolloServer } from "apollo-server-express";
const { createContext, EXPECTED_OPTIONS_KEY } = require("dataloader-sequelize");
const bullBoard = require("bull-board");
import Schedule from "./schedule";
import { ENV } from "./config";
import { sequelize } from "./models";
import { resolver as resolvers, schema, schemaDirectives } from "./graphql";
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
import { auth_route } from "../src/routes/auth_route";
const VERSION = "0.0.3";
const { PORT } = ENV;
console.log("bullBoard", bullBoard.router);

const routes = express.Router();
const authMiddleWare = (req, res, next) => {
  const { x_authorization } = req.headers;
  const access_token_secret = ENV.JWT_ENCRYPTION;
  if (x_authorization) {
    const verified = jwt.verify(x_authorization, access_token_secret, {
      ignoreExpiration: true,
    });
    req.user = verified;
  }
  next();
};
const app = express();
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});
// apply cors middleware to check cross origin resource sharing
app.use(cors());
// aplly auth middleware to check authentication
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(authMiddleWare);
app.use("/", routes);
app.use("/arena", bullBoard.router);
routes.use("/auth", auth_route);

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  playground: ENV.NODE_ENV != "production",
  schemaDirectives,
  context: ({ req }) => {
    return {
      [EXPECTED_OPTIONS_KEY]: createContext(sequelize),
      user: req["user"],
    };
  },
});

server.applyMiddleware({
  app,
  cors: true,
  bodyParserConfig: {
    limit: "100mb",
  },
});

app.listen({ port: PORT }, () => {
  const scheduler = new Schedule();
  scheduler.startJobs();
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`Version: ${VERSION} `);
});
