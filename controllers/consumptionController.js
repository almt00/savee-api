const express = require("express");
const prisma = require("../lib/prisma.js");
const router = express.Router();
const userController = require("./userController.js");

router.get("(/user/:user_id)", async function (req, res) {
  const { user_id } = req.params;
  const user_consumptions = await prisma.consumptionHistory.findMany({
    where: {
      user_id: user_id,
    },
    orderBy: {
      consumption_date: "desc",
    },
    include: {
      task: {
        select: {
          start_time: true,
          end_time: true,
          task: true,
        },
      },
      routine: {
        select: {
          duration_routine: true,
          creation_routine: true,
          task: true,
        },
      },
    },
  });
  res.json(user_consumptions);
});

router.get("(/user/:user_id/today)", async function (req, res) {
  const { user_id } = req.params;
  const today_consumptions = await prisma.consumptionHistory.findMany({
    where: {
      user_id: user_id,
      consumption_date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
    include: {
      task: {
        select: {
          start_time: true,
          end_time: true,
          task: true,
        },
      },
      routine: {
        select: {
          duration_routine: true,
          creation_routine: true,
          task: true,
        },
      },
    },
  });
  res.json(today_consumptions);
});

router.get("(/user/:user_id/current_period)", async function (req, res) {
  const { user_id } = req.params;
  const { date_payment } = await userController.get(
    "/:user_id/payment/date_payment"
  );
  let gteDate = new Date();
  let lteDate = new Date();

  if (date_payment && !isNaN(Date.parse(date_payment))) {
    gteDate = new Date(date_payment);
  } else {
    // set a default value if date_payment is invalid
    gteDate.setMonth(gteDate.getMonth() - 1);
  }

  const current_period_consumptions = await prisma.consumptionHistory.findMany({
    where: {
      user_id: "user_id",
      consumption_date: {
        // greater than or equal to last date_payment  and less than or equal to today
        lte: new Date(lteDate.setHours(0, 0, 0, 0)),
        gte: new Date(gteDate.setHours(0, 0, 0, 0)),
      },
    },
    include: {
      task: {
        select: {
          start_time: true,
          end_time: true,
          task: true,
        },
      },
      routine: {
        select: {
          duration_routine: true,
          creation_routine: true,
          task: true,
        },
      },
    },
  });
  res.json(current_period_consumptions);
});

router.get("/house/:house_id", async (req, res) => {
  const { house_id } = req.params;
  const house_consumptions = await prisma.consumptionHistory.findMany({
    where: {
      house_id: parseInt(house_id),
    },
    include: {
      task: {
        select: {
          start_time: true,
          end_time: true,
          task: true,
        },
      },
      routine: {
        select: {
          duration_routine: true,
          creation_routine: true,
          task: true,
        },
      },
    },
  });
  res.json(house_consumptions);
});

module.exports = router;
