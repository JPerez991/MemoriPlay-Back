import dotenv from "dotenv";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } from "./db/config";
import Server from "./models/server";

//dotenv.config();
console.log("variables de entorno: ", {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
});
const server = new Server();
