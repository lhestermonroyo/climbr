import mysql2 from 'mysql2';

class DBConn {
  private db: mysql2.Connection;

  constructor() {
    this.db = mysql2.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'kicktalk_app',
    });
  }

  checkConnection = () => {
    this.db.connect(err => {
      if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
          console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
          console.error('Database connection was refused.');
        }
      } else {
        console.log('Database connected successfully.');
      }
    });
  };

  query = async (sql: string, values: any) => {
    return new Promise((resolve, reject) => {
      const cb = (err: any, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      };

      this.db.query(sql, values, cb);
    }).catch(err => {
      console.error('Error querying the database:', err);
      throw err;
    });
  };
}

export default new DBConn().query;
