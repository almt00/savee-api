const express = require("express");
const bodyParser = require("body-parser");

const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const user = require("./controllers/userController.js");
const house = require("./controllers/houseController.js");
const consumption = require("./controllers/consumptionController.js");

/* dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL); */

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* app.get("/users", async (req, res) => {
  let status = 200;
  let retVal = {};

  try {
    const query = "SELECT * FROM user";
    const [rows] = await connection.query(query);
    retVal.data = rows;
  } catch (error) {
    console.error(error);
    retVal.error = error;
    status = 500;
  } finally {
    res.status(status).json(retVal);
  }
}); */

/* app.get("/users/:id", async (req, res) => {
  let status = 200;
  let retVal = {};

  const { id } = req.params;
  if (isNaN(Number(id))) {
    status = 400;
    retVal.message =
      "Invalid request. Please make sure the id you are searching for is a number";
    return res.status(status).json(retVal);
  }

  try {
    const query = "SELECT * FROM user WHERE user_id=?";
    const [rows] = await connection.query(query, [id]);

    retVal.data = rows[0];
    if (!retVal.data) {
      status = 404;
      retVal.message = `Couldn't find a user with id ${id}`;
    }
  } catch (error) {
    console.error(error);
    retVal.error = error;
    status = 500;
  } finally {
    res.status(status).json(retVal);
  }
}); */

app.get("/api", (req, res) => {
  res.send(`Hello!`);
});

app.use("/user", user);
app.use("/house", house);
app.use("/consumption", consumption);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("App is running");
});

module.exports = app;
