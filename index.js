const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const user = require("./controllers/userController.js");
const house = require("./controllers/houseController.js");
const consumption = require("./controllers/consumptionController.js");
const invite = require("./emailInvite.js");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.use("/user", user);
app.use("/house", house);
app.use("/consumption", consumption);
app.use("/invite", invite);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App is running on port ${port} `);
});

module.exports = app;
