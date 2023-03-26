import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const app = express();

app.get("/users", async (req, res) => {
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
});

app.get("/users/:id", async (req, res) => {
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
    const query = "SELECT * FROM user WHERE user.id=?";
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
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("App is running");
});
