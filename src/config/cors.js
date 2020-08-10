const cors = require("cors");

const corsOptions = {
  origin: "https://gobarbers.herokuapp.com",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

function chooseCors() {
  if (process.env.NODE_ENV == "production") {
    return cors(corsOptions);
  } else return cors();
}

module.exports = chooseCors();
