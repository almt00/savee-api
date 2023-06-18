const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const http = require("http");
const authenticate = require("../middlewares/authMiddleware.js");

const makePostRequest = async () => {
  const secretKey = process.env.TOKEN_SECRET;
  const issuer = process.env.TOKEN_ISSUER;

  const token = jwt.sign({}, secretKey, {
    expiresIn: "24h",
    issuer: issuer,
  });

  const endpoint = "https://savee-api.vercel.app/consumption/user/all";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-cron-token": token,
    },
  };

  const req = http.request(endpoint, options, (res) => {
    let response = "";

    res.on("data", (chunk) => {
      response += chunk;
    });

    res.on("end", () => {
      console.log(response);
    });
  });

  req.on("error", (error) => {
    console.error("Error executing cron job:", error);
  });

  req.end();
};

cron.schedule("0 6,12,18 * * *", makePostRequest);