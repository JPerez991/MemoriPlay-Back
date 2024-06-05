"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProgress = exports.getGeneralProgress = exports.getProgress = exports.getAllByUserId = exports.getAll = exports.getById = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getById = (id) => {
    const slq = "SELECT * FROM activity WHERE id = ?";
    return new Promise((resolve, reject) => {
        connection_1.default.query(slq, [id], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                if (result.length === 0) {
                    resolve({ data: [] });
                }
                else {
                    resolve({ data: result[0] });
                }
            }
        });
    });
};
exports.getById = getById;
const getAll = () => {
    const sql = "SELECT * FROM activity";
    return new Promise((resolve, reject) => {
        connection_1.default.query(sql, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                if (result.length === 0) {
                    resolve({ data: [] });
                }
                else {
                    resolve({ data: result });
                }
            }
        });
    });
};
exports.getAll = getAll;
const getAllByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `
      SELECT activity.id, activity.name, activity.level, activity.category_id, activity.target_points
      FROM user_progress
      JOIN activity ON user_progress.activity_id = activity.id
      WHERE user_progress.user_id = ?;
    `;
    return new Promise((resolve, reject) => {
        connection_1.default.query(sql, [userId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({ data: result });
            }
        });
    });
});
exports.getAllByUserId = getAllByUserId;
const getProgress = (id) => {
    const sql = "SELECT * FROM user_progress WHERE id = ?";
    return new Promise((resolve, reject) => {
        connection_1.default.query(sql, [id], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                if (result.length === 0) {
                    resolve({ data: [] });
                }
                else {
                    const transformedResult = result.map((item) => (Object.assign(Object.assign({}, item), { completed: item.completed === 1 })));
                    resolve({ data: transformedResult[0] });
                }
            }
        });
    });
};
exports.getProgress = getProgress;
const getGeneralProgress = (id) => {
    const sql = "SELECT activity.id AS activity_id, activity.name AS name, SUM(CAST(user_progress.completed AS SIGNED)) AS completed_levels, COUNT(activity_levels.id) AS total_levels, MIN(CASE WHEN user_progress.completed = 0 THEN activity_levels.level END) AS next_level, MIN(CASE WHEN user_progress.completed = 0 THEN user_progress.id END) AS next_level_register_id FROM users JOIN user_progress ON users.id = user_progress.user_id JOIN activity_levels ON user_progress.activity_level_id = activity_levels.id JOIN activity ON activity_levels.activity_id = activity.id WHERE users.id = ? GROUP BY activity.id ORDER BY activity.id, MIN(activity_levels.level)";
    return new Promise((resolve, reject) => {
        connection_1.default.query(sql, [id], (err, result) => {
            if (err) {
                reject(err.message);
            }
            else {
                resolve({ data: result });
            }
        });
    });
};
exports.getGeneralProgress = getGeneralProgress;
const updateProgress = (progress) => {
    console.log(progress);
    const sql = "UPDATE user_progress SET ? WHERE id = ?";
    return new Promise((resolve, reject) => {
        connection_1.default.query(sql, [progress, progress.id], (err, result) => {
            if (err) {
                reject(err.message);
            }
            else {
                console.log(result);
                if (result.affectedRows > 0) {
                    resolve({
                        msg: true,
                    });
                }
                else {
                    resolve({
                        msg: false,
                    });
                }
            }
        });
    });
};
exports.updateProgress = updateProgress;
