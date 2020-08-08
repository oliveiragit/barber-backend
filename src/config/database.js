require("dotenv/config");
const enviroment = {
  development: {
    dialect: "postgres",
    host: process.env.DATABASE_URL,
    // host: process.env.DB_HOST,
    // username: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_NAME,
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    dialect: "postgres",
    host: process.env.DATABASE_URL,
    // host: process.env.DB_HOST,
    // username: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_NAME,
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};

module.exports = enviroment[process.env.NODE_ENV];
