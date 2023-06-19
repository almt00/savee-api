const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();

const performPostRequest = async () => {
  const secret = process.env.TOKEN_SECRET;
  const issuer = process.env.TOKEN_ISSUER;

  const token = jwt.sign({}, secret, {
    expiresIn: "24h",
    issuer: issuer,
  });

  const endpoint = "https://savee-api.vercel.app/consumption/user/all";

  const options = {
    headers: {
      "Content-Type": "application/json",
      "x-cron-token": token,
    },
  };

  try {
    const response = await axios.post(endpoint, {}, options);
    console.log(response.data);
  } catch (error) {
    console.error("Error executing cron job:", error.message);
  }
};

performPostRequest();
