// //CORS Cross Origin Resource Sharing
// const whitelist = [
//   "https://www.yoursite.com",
//   "http://127.0.0.1:5000",
//   "http://localhost:3500",
//   "https://www.google.co.uk",
// ];

const allowedOrigins = require("./allowedOrigins");
const corsOptions = {
  origin: (origin, callback) => {
    //origin in()   - who request
    if (allowedOrigins.indexOf(origin) != -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionSuccessStatus: 200,
};

module.exports = corsOptions;
