const glue = require("schemaglue");
const fs = require("fs");
const path = require("path");

export const getAllFunctionInPath = (p: string, f: "query" | "mutation") => {
  const pathStr = path.join(p, f);
  const basename = path.basename(__filename);
  const functions = {};

  fs.readdirSync(pathStr)
    .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === `.${process.env.START_MODE || "ts"}`)
    .forEach((file) => {
      functions[file.slice(0, -3)] = require(path.join(pathStr, file));
    });
  return functions;
};

export { schemaDirectives } from "./directives";
const graphqlDir = process.env.START_MODE === "js" ? __dirname : "src/graphql";
export const { schema, resolver } = glue(graphqlDir, { mode: process.env.START_MODE || "ts" });
