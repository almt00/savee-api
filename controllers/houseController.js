const express = require("express");
const router = express.Router();

// house details route
router.get("/:house_id", function (req, res) {
  res.send({
    house_id: `${req.params.house_id}`,
    house_name: "Casa do Pedro",
  });
});

router.post("/", (req, res) => {
  let data = req.body;
  res.send("house added: " + JSON.stringify(data));
});

router.put("/:house_id", (req, res) => {
  let data = req.body;
  res.send("house info added: " + JSON.stringify(data));
});

router.get("/:house_id/payment", (req, res) => {
  res.send([
    {
      payment_id: 1,
      date_payment: "2022-12-01",
      value_payment: 80,
      house_id: 1,
    },
    {
      payment_id: 2,
      date_payment: "2023-01-01",
      value_payment: 85,
      house_id: 1,
    },
  ]);
});

router.get("/:house_id/payment/:payment_id", (req, res) => {
  //isto mete-se assim??
  res.send({
    payment_id: `${req.params.payment_id}`,
    date_payment: "2022-12-01",
    value_payment: 80,
    house_id: 1,
  });
});

router.post("/:house_id/payment", (req, res) => {
  let data = req.body;
  res.send("house payment added: " + JSON.stringify(data));
});

module.exports = router;
