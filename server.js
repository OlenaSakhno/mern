// const http = require("http");
const { response } = require("express");
const express = require("express");
const path = require("path");

require("dotenv").config();
const app = express();
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PROT || 3500;

//Connect to MongoDB
connectDB();

//custom m/w
app.use(logger);

//Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions));

//build-in middleware ho handle urlencodred data (form data: 'content-type: application/x-www-form-urlencoded')
app.use(express.urlencoded({ extended: false }));

// m/w for json
app.use(express.json());

// m/w for cookies
app.use(cookieParser());
//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public"))); // to use public foe subdir

//route
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use(verifyJWT); // everything after this line will use JWt, so 23 top routes do not use verify
//app.use("/subdir", require("./routes/subdir"));
app.use("/employees", require("./routes/api/employees"));

// const fs = require("fs");
// const fsPromises = require("fs").promises;
//
//initialize object
//const myEmitter = new MyEmitter();
// //add event listener for the logEvent
// myEmitter.on("log", (message) => logEvents(message));
// setTimeout(() => {
//   //emit the event
//   myEmitter.emit("log", "Log event emitted!");
// }, 2000);

// const server = http.createServer((req, res) => {
//   console.log(req.url, req.method);
// });

// app.get("^/$|/index(.html)?", (req, res) => {
//   // res.send("HELLO");
//   // res.sendFile("./views/index.html", { root: __dirname }); one way
//   res.sendFile(path.join(__dirname, "./views/index.html"));
// });

// app.get("/new-page(.html)?", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "new-page.html"));
// });

// app.get("/old-page(.html)?", (req, res) => {
//   res.redirect(301, "/new-page.html"); //302 redirect by default
// });

//Route handlers
// app.get(
//   "/hello(.html)?",
//   (req, res, next) => {
//     console.log("attempted to load hello.html");
//     next();
//   },
//   (req, res) => {
//     res.send("HELLO from next!");
//   }
// );

// //chaining route
// const one = (req, res, next) => {
//   console.log("function one");
//   next();
// };
// const two = (req, res, next) => {
//   console.log("function two");
//   next();
// };
// const three = (req, res) => {
//   console.log("function three");
//   res.send("FINISH");
// };

// app.get("/chain(.html)?", [one, two, three]);

//404
// app.get("/*", (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });
//app.use does not accept regex, app.all() accept regex and apply to all http methods
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("application/http")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Page not found" });
  } else res.type("txt").send("404 Page not found");
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
});
