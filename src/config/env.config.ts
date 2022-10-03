import * as dotEnv from "dotenv";
dotEnv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  DB_HOSTNAME: process.env.DB_HOSTNAME || "127.0.0.1",
  DB_PORT: process.env.DB_PORT || "3306",
  DB_NAME: process.env.DB_NAME || "learn_db",
  DB_USERNAME: process.env.DB_USERNAME || "root",
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DIALECT: process.env.DB_DIALECT || "mysql",
  REDIS_PORT: process.env.REDIS_PORT || "6379",
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  JWT_ENCRYPTION: process.env.JWT_ENCRYPTION || "binhnguyen",
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "10m",
};
