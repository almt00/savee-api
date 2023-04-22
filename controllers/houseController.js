const express = require("express");
const prisma = require("../lib/prisma.js");
const router = express.Router();

// house details route
router.get("/:house_id", async function (req, res) {
  const { house_id } = req.params;
  const house = await prisma.house.findUnique({
    where: {
      house_id: parseInt(house_id),
    },
  });
  res.json(house);
});

router.post("/", async (req, res) => {
  const { house_name } = req.body;
  await prisma.house.create({
    data: {
      house_name: house_name,
    },
  });
});

router.put("/:house_id", (req, res) => {
  let data = req.body;
  res.send("house info added: " + JSON.stringify(data));
});

router.get("/:house_id/payment", async (req, res) => {
  const { house_id } = req.params;
  const payments = await prisma.paymentHistory.findMany({
    where: {
      house_id: parseInt(house_id),
    },
  });
  res.json(payments);
});

router.get("/:house_id/payment/:payment_id", async (req, res) => {
  const { house_id, payment_id } = req.params;
  const payment = await prisma.paymentHistory.findFirst({
    where: {
      payment_id: parseInt(payment_id),
      house_id: parseInt(house_id),
    },
    include: {
      UserPayment: true,
      User: true,
    },
  });
  res.json(payment);
});

router.post("/:house_id/payment", async (req, res) => {
  const { house_id } = req.params;
  const { date_payment, value_payment } = req.body;
  const payment = await prisma.paymentHistory.create({
    data: {
      house_id: parseInt(house_id),
      date_payment: new Date(date_payment),
      value_payment: value_payment,
    },
  });
  res.json(payment);
});

module.exports = router;
