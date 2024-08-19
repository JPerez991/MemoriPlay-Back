"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("../db/connection"));
const activity_routes_1 = __importDefault(require("../routes/activity.routes"));
const default_routes_1 = __importDefault(require("../routes/default.routes"));
const user_routes_1 = __importDefault(require("../routes/user.routes"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("../db/config");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = config_1.PORT;
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
        connection_1.default.connect((err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Successfully connected to the database xd");
            }
        });
    }
    routes() {
        this.app.use("/", default_routes_1.default);
        this.app.use("/api/activity", activity_routes_1.default);
        this.app.use("/api/users", user_routes_1.default);
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
    }
}
exports.default = Server;
