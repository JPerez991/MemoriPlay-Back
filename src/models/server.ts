import express from "express";
import connection from "../db/connection";
import routesActivity from "../routes/activity.routes";
import routesDefault from "../routes/default.routes";
import routesUser from "../routes/user.routes";
import cors from "cors";
import { PORT } from "../db/config";

class Server {
  private app: express.Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = PORT;
    this.listen();
    this.connectDB();
    this.middlewares();
    this.routes();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port: ", this.port);
    });
  }

  connectDB() {
    connection.connect((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully connected to the database xd");
      }
    });
  }

  routes() {
    this.app.use("/", routesDefault);
    this.app.use("/api/activity", routesActivity);
    this.app.use("/api/users", routesUser);
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }
}

export default Server;
