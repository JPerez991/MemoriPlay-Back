import mysql from "mysql2";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./config";
import { URL } from "url";

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connection: mysql.Connection;

  private constructor() {
    console.log("CONNECTING TO ", { DB_NAME, DB_HOST, DB_PORT, DB_USER });
    this.connection = mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
    });

    this.connection.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL:", err.message);
        return;
      }
      console.log("Connected to MySQL.");
      this.initializeDatabase();
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getConnection(): mysql.Connection {
    return this.connection;
  }

  private initializeDatabase() {
    // No longer creating the database, just switching to it
    this.connection.changeUser({ database: DB_NAME }, (err) => {
      if (err) {
        console.error("Error switching to database:", err.message);
        return;
      }
      console.log(`Switched to database ${DB_NAME}.`);

      // Now check for the existence of the necessary tables
      this.createTablesIfNotExist();
    });
  }

  private createTablesIfNotExist() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS \`activity\` (
        \`id\` int(10) NOT NULL AUTO_INCREMENT,
        \`category_id\` int(10) NOT NULL,
        \`name\` varchar(250) NOT NULL,
        \`description\` text NOT NULL,
        \`instruction\` text NOT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`category_id\` (\`category_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`activity_levels\` (
        \`id\` int(10) NOT NULL AUTO_INCREMENT,
        \`activity_id\` int(10) NOT NULL,
        \`level\` int(10) NOT NULL,
        \`target_points\` int(10) NOT NULL DEFAULT 500,
        PRIMARY KEY (\`id\`),
        KEY \`activity_id\` (\`activity_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`category\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(50) NOT NULL,
        \`description\` text NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` int(10) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(250) NOT NULL,
        \`surname\` varchar(250) NOT NULL,
        \`phone\` varchar(15) DEFAULT NULL,
        \`email\` varchar(250) NOT NULL,
        \`password\` varchar(250) NOT NULL,
        \`age\` int(10) DEFAULT NULL,
        \`gender\` varchar(50) DEFAULT NULL,
        \`address\` text DEFAULT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS \`user_progress\` (
        \`id\` int(10) NOT NULL AUTO_INCREMENT,
        \`activity_level_id\` int(10) NOT NULL,
        \`user_id\` int(10) NOT NULL,
        \`total_points\` int(10) DEFAULT NULL,
        \`completed\` tinyint(1) NOT NULL DEFAULT 0,
        \`last_date\` date NOT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`activity_id\` (\`activity_level_id\`),
        KEY \`user_id\` (\`user_id\`),
        KEY \`activity_level_id\` (\`activity_level_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
    ];

    tables.forEach((tableQuery) => {
      this.connection.query(tableQuery, (err) => {
        if (err) {
          console.error("Error creating table:", err.message);
        } else {
          console.log("Table initialized or already exists.");
        }
      });
    });
  }
}

const connection = DatabaseConnection.getInstance().getConnection();
export default connection;
