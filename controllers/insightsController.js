const express = require("express");
const prisma = require("../lib/prisma.js");
const router = express.Router();
const consumptionController = require("./consumptionController.js");

// insight by user
// group consumptions by payment_id based on date_payment

router.get("(/user/:user_id)", async function (req, res) {
  const { user_id } = req.params;
  const { user_consumption } = await consumptionController.get(
    "/user/:user_id"
  );

  const user_insights = await prisma.userPayment.findMany({
    where: {
      user_id: parseInt(user_id),
    },
    include: {
      payment: {
        select: {
          date_payment: true,
          value_payment: true,
        },
      },
    },
  });
  res.json(user_insights);
});

module.exports = router;
