const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const user = require("./controllers/userController.js");
const house = require("./controllers/houseController.js");
const consumption = require("./controllers/consumptionController.js");
const auth = require("./controllers/authController.js");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);
app.use(passport.authenticate("session"));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.use("/user", user);
app.use("/house", house);
app.use("/consumption", consumption);
app.use("/auth", auth);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App is running on port ${port} `);
});

module.exports = app;
