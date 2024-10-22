import connection from "../db/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import convertMinutesToMillis from "../utils/time-converter";
import { User } from "../models/user.type";
import { RowDataPacket, OkPacket } from "mysql2";
import { TOKEN_EXPIRATION_TIME } from "../db/config";

const EXPIRATION_TIME = convertMinutesToMillis(TOKEN_EXPIRATION_TIME);

export const login = async (email: string, password: string): Promise<any> => {
  const sql = "SELECT * FROM users WHERE email = ?";

  return new Promise((resolve, reject) => {
    connection.query(sql, [email], (err, result: RowDataPacket[]) => {
      if (err) {
        reject(err.message);
      } else {
        let data: any = {};
        if (result.length === 0) {
          resolve({ msg: "Invalid Email" });
        } else {
          data = result[0];
          const userPassword = data.password;
          bcrypt.compare(password, userPassword, (err, isMatch) => {
            if (err) {
              reject(err.message);
            } else {
              if (isMatch) {
                const token = jwt.sign(
                  {
                    name: data.name,
                    surname: data.surname,
                    phone: data.phone,
                    email: data.email,
                    address: data.address,
                    age: data.age,
                    gender: data.gender,
                  },
                  process.env.SECRET_KEY!,
                  {
                    expiresIn: EXPIRATION_TIME.toString(),
                  }
                );
                const dataWithoutPassword = { ...data };
                delete dataWithoutPassword.password;
                resolve({ token: token, data: dataWithoutPassword });
              } else {
                resolve({ msg: "Invalid Password" });
              }
            }
          });
        }
      }
    });
  });
};

export const signIn = async (user: User): Promise<any> => {
  return new Promise((resolve, reject) => {
    bcrypt
      .hash(user.password!, 10)
      .then((hash) => {
        connection.query(
          "INSERT INTO users SET ?",
          {
            name: user.name,
            surname: user.surname,
            password: hash,
            email: user.email,
            address: user.address,
            age: user.age,
            gender: user.gender,
            phone: user.phone,
          },
          (err, data: OkPacket) => {
            if (err) {
              reject(err.message);
            } else {
              if (data.affectedRows > 0) {
                const sqlUserProgress =
                  "INSERT INTO user_progress (activity_level_id, user_id, total_points, completed, last_date) SELECT activity_levels.id AS activity_level_id, ? AS user_id, 0 AS total_points, 0 AS completed, NOW() AS last_date FROM activity_levels INNER JOIN activity ON activity_levels.activity_id = activity.id WHERE activity_levels.id NOT IN (SELECT DISTINCT activity_level_id FROM user_progress WHERE user_id = ?) AND activity_levels.id IS NOT NULL";

                const userId = data.insertId;
                connection.query(
                  sqlUserProgress,
                  [userId, userId],
                  (err, result: OkPacket) => {
                    if (err) {
                      reject(err.message);
                    } else {
                      if (result.affectedRows > 0) {
                        resolve({ msg: "Successfully registered", data: true });
                      } else {
                        resolve({ msg: "Registration failed", data: false });
                      }
                    }
                  }
                );
              } else {
                resolve({ msg: "Registration failed", data: false });
              }
            }
          }
        );
      })
      .catch((err) => {
        reject(err.message);
      });
  });
};

export const update = async (user: User, newPassword: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [user.id],
      (err, result: RowDataPacket[]) => {
        if (err) {
          reject(err.message);
        } else {
          if (result.length === 0) {
            reject("Invalid user");
          } else {
            const updateData: User = { ...user };

            bcrypt.compare(
              user.password!,
              result[0].password,
              (err, isMatch) => {
                if (err) {
                  reject(err.message);
                } else {
                  if (isMatch) {
                    if (newPassword) {
                      bcrypt.hash(newPassword, 10).then((hash) => {
                        updateData.password = hash;

                        connection.query(
                          "UPDATE users SET ? WHERE id = ?",
                          [updateData, user.id],
                          (err, data: OkPacket) => {
                            if (err) {
                              reject(err.message);
                            } else {
                              if (data.affectedRows > 0) {
                                resolve({ msg: true });
                              } else {
                                resolve({ msg: false });
                              }
                            }
                          }
                        );
                      });
                    } else {
                      delete updateData.password;
                      connection.query(
                        "UPDATE users SET ? WHERE id = ?",
                        [updateData, user.id],
                        (err, data: OkPacket) => {
                          if (err) {
                            reject(err.message);
                          } else {
                            if (data.affectedRows > 0) {
                              resolve({ msg: true });
                            } else {
                              resolve({ msg: false });
                            }
                          }
                        }
                      );
                    }
                  } else {
                    resolve({ msg: false });
                  }
                }
              }
            );
          }
        }
      }
    );
  });
};
