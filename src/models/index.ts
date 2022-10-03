import { Sequelize } from "sequelize-typescript";
import { ENV } from "../config/env.config";

export const sequelize = new Sequelize({
  database: ENV.DB_NAME,
  host: ENV.DB_HOSTNAME,
  port: +ENV.DB_PORT,
  dialect: "mysql",
  username: ENV.DB_USERNAME,
  password: ENV.DB_PASSWORD,
  storage: ":memory:",
  logging: false,
  // Enforcing the table name to be equal to the model name (Table name inference)
  define: {
    freezeTableName: true,
  },
  modelPaths: [__dirname + "/*.model.*s"],
  modelMatch: (filename, member) => {
    return filename.substring(0, filename.indexOf(".model")) === member.toLowerCase();
  },
  pool: {
    max: 7,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
});

export { User } from "./user.model";
