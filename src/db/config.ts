import dotenv from "dotenv";
dotenv.config();
export const PORT = process.env.PORT?.toString() || "3002";
export const DB_HOST = process.env.HOST_BD || "localhost";
export const DB_PORT = Number(process.env.PORT_BD) || 3306;
export const DB_NAME = process.env.NAME_BD; //|| "databasename";
export const DB_USER = process.env.USER_BD || "root";
export const DB_PASSWORD = process.env.PASSWORD_BD || "";
export const TOKEN_EXPIRATION_TIME =
  Number(process.env.TOKEN_EXPIRATION_TIME) || 60;
