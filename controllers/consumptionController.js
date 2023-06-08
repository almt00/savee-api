const express = require("express");
const prisma = require("../lib/prisma.js");
const userController = require("./userController.js");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware.js");
//const processRoutinesForUser = require("../scheduler.js");

router.get("(/user/:user_id)", authenticate, async function (req, res) {
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

router.post("/user/:user_id", authenticate, async function (req, res) {
  const { user_id } = req.params;
  const { task_id, routine_id, house_id } = req.body;
  const consumption = await prisma.consumptionHistory.create({
    data: {
      user_id: user_id,
      task_id: task_id,
      routine_id: routine_id,
      house_id: parseInt(house_id),
    },
  });
  res.json(consumption);
});

router.post("/user/all", authenticate, async function (req, res) {
  /*const users = await prisma.user.findMany();
  for (const user of users) {
    await processRoutinesForUser(user.user_id);
  }
  res.json({ message: "success" });
});*/

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const current_period =
    today.getHours() < 12
      ? "morning"
      : today.getHours() < 19
      ? "afternoon"
      : "night";

  const { all_users } = await userController.get("/");
  for (const user of all_users) {
    const { routines } = await userController.get(
      "/" + user.user_id + "/routine"
    );
    for (const routine of routines) {
      const { weekdays, period_time } = routine;

      if (weekdays.includes(dayOfWeek) && period_time === current_period) {
        const { user_id, house_id } = user;
        const { routine_id, duration_routine } = routine;
        const consumption = await prisma.consumptionHistory.create({
          data: {
            user_id: user_id,
            routine_id: routine_id,
            house_id: parseInt(house_id),
            payment_id: null, //mudar isto
            task: null,
            task_id: null,
            consumption: duration_routine,
            consumption_date: new Date(),
            type: 0, // não sei o que é isto lmao
            routine: {
              connect: {
                routine_id: routine_id,
              },
            },
          },
        });
      }
    }
  }
  res.json({ message: "success" });
});

router.get("(/user/:user_id/today)", authenticate, async function (req, res) {
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

router.get(
  "(/user/:user_id/current_period)",
  authenticate,
  async function (req, res) {
    const { user_id } = req.params;
    const { date_payment } = await userController.get(
      `/${user_id}/payment/date_payment`
    );
    let gteDate = new Date();
    let lteDate = new Date();

    if (date_payment && !isNaN(Date.parse(date_payment))) {
      gteDate = new Date(date_payment);
    } else {
      // set a default value if date_payment is invalid
      gteDate.setMonth(gteDate.getMonth() - 1);
    }

    const current_period_consumptions =
      await prisma.consumptionHistory.findMany({
        where: {
          user_id: user_id,
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
  }
);

router.get("/house/:house_id", authenticate, async (req, res) => {
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
