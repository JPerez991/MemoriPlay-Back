import connection from "../db/connection";
import { UserProgress } from "../models/user-progress.type";
import { RowDataPacket, OkPacket } from "mysql2";

export const getById = async (id: number): Promise<{ data: any }> => {
  const sql = "SELECT * FROM activity WHERE id = ?";
  return new Promise((resolve, reject) => {
    connection.query(sql, [id], (err, result: RowDataPacket[]) => {
      if (err) {
        return reject(err.message);
      } else {
        resolve({ data: result.length === 0 ? [] : result[0] });
      }
    });
  });
};

export const getAll = async (): Promise<{ data: any[] }> => {
  const sql = "SELECT * FROM activity";
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result: RowDataPacket[]) => {
      if (err) {
        return reject(err.message);
      } else {
        resolve({ data: result.length === 0 ? [] : result });
      }
    });
  });
};

export const getAllByUserId = async (
  userId: number
): Promise<{ data: any[] }> => {
  const sql = `
    SELECT activity.id, activity.name, activity.level, activity.category_id, activity.target_points
    FROM user_progress
    JOIN activity ON user_progress.activity_id = activity.id
    WHERE user_progress.user_id = ?;
  `;
  return new Promise((resolve, reject) => {
    connection.query(sql, [userId], (err, result: RowDataPacket[]) => {
      if (err) {
        return reject(err.message);
      } else {
        resolve({ data: result });
      }
    });
  });
};

export const getProgress = async (id: number): Promise<{ data: any }> => {
  const sql = "SELECT * FROM user_progress WHERE id = ?";
  return new Promise((resolve, reject) => {
    connection.query(sql, [id], (err, result: RowDataPacket[]) => {
      if (err) {
        return reject(err.message);
      } else {
        const transformedResult = result.map((item: any) => ({
          ...item,
          completed: item.completed === 1,
        }));
        resolve({
          data: transformedResult.length === 0 ? [] : transformedResult[0],
        });
      }
    });
  });
};

export const getGeneralProgress = async (
  id: number
): Promise<{ data: any[] }> => {
  const sql = `
    SELECT activity.id AS activity_id, activity.name AS name,
           SUM(CAST(user_progress.completed AS SIGNED)) AS completed_levels,
           COUNT(activity_levels.id) AS total_levels,
           MIN(CASE WHEN user_progress.completed = 0 THEN activity_levels.level END) AS next_level,
           MIN(CASE WHEN user_progress.completed = 0 THEN user_progress.id END) AS next_level_register_id
    FROM users
    JOIN user_progress ON users.id = user_progress.user_id
    JOIN activity_levels ON user_progress.activity_level_id = activity_levels.id
    JOIN activity ON activity_levels.activity_id = activity.id
    WHERE users.id = ?
    GROUP BY activity.id
    ORDER BY activity.id, MIN(activity_levels.level)
  `;

  return new Promise((resolve, reject) => {
    connection.query(sql, [id], (err, result: RowDataPacket[]) => {
      if (err) {
        return reject(err.message);
      } else {
        resolve({ data: result });
      }
    });
  });
};

export const updateProgress = async (
  progress: UserProgress
): Promise<{ msg: boolean }> => {
  const sql = "UPDATE user_progress SET ? WHERE id = ?";
  return new Promise((resolve, reject) => {
    connection.query(sql, [progress, progress.id], (err, result: OkPacket) => {
      if (err) {
        return reject(err.message);
      } else {
        resolve({ msg: result.affectedRows > 0 });
      }
    });
  });
};
