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
  const { house_id, payment_id, routine_id, task_id, consumption, type } =
    req.body;
  const consumption_entry = await prisma.consumptionHistory.create({
    data: {
      house_id: house_id,
      user_id: user_id,
      payment_id: payment_id,
      routine_id: routine_id,
      task_id: task_id,
      consumption_date: new Date(),
      consumption: consumption,
      type: type,
    },
  });
  res.json(consumption_entry);
});

router.post("/user/all", authenticate, async function (req, res) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const current_period =
    today.getHours() < 12
      ? "morning"
      : today.getHours() < 19
      ? "afternoon"
      : "night";

  // iterate over all users in the database
  const allUsers = await prisma.user.findMany();

  for (const user of allUsers) {
    // for each user, get all routines
    const routines = await prisma.userRoutine.findMany({
      where: {
        user_id: user.user_id,
      },
    });

    // for each routine, check if it is scheduled for today
    for (const routine of routines) {
      const { weekdays, period_time } = routine;

      if (weekdays.includes(dayOfWeek) && period_time === current_period) {
        const { user_id, house_id } = user;
        const { routine_id, duration_routine, creation_routine, task } =
          routine;
        const consumption = await prisma.consumptionHistory.create({
          data: {
            user: user_id,
            routine_id: routine_id,
            house: parseInt(house_id),
            payment: null, //mudar isto
            task: null,
            task_id: null,
            consumption: duration_routine,
            consumption_date: new Date(),
            type: 0, // não sei o que é isto lmao
            routine: {
              connect: {
                routine_id: routine_id,
              },
              duration_routine: duration_routine,
              creation_routine: creation_routine,
              task: task,
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
