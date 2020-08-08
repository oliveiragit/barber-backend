require("dotenv/config");

const Sequelise = require("sequelize");
//const databaseConfig = require("../config/database");
const mongoose = require("mongoose");
const User = require("../app/models/User");
const File = require("../app/models/File");
const Appointment = require("../app/models/Appointment");

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }
  init() {
    try {
      this.connection = new Sequelise(process.env.DATABASE_URL, {
        dialectOptions: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      });
      models
        .map((model) => model.init(this.connection))
        .map(
          (model) => model.associate && model.associate(this.connection.models)
        );
    } catch (error) {
      return error;
    }
  }
  mongo() {
    try {
      this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      return { e: "mongo crash" };
    }
  }
}
module.exports = new Database();
