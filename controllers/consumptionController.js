const express = require("express");
const prisma = require("../lib/prisma.js");
const userController = require("./userController.js");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware.js");

router.get("(/user/:user_id)", authenticate, async function (req, res) {
  const { user_id } = req.params;
  const user_consumptions = await prisma.consumptionHistory.findMany({
    where: {
      user_id: user_id,
    },
    orderBy: {
      consumption_date: "asc",
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
      house_id: parseInt(house_id),
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

router.post("/matching-routines", authenticate, async function (req, res) {
  try {
    await prisma.$transaction(async (prisma) => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const current_period =
        today.getHours() < 12
          ? "morning"
          : today.getHours() < 19
          ? "afternoon"
          : "night";

      const allUsers = await prisma.user.findMany();

      for (const user of allUsers) {
        console.log("Processing user:", user.user_id);

        // Fetch the last payment_id for the user
        const lastPayment = await prisma.userPayment.findFirst({
          where: {
            user_id: user.user_id,
          },
          orderBy: {
            payment_id: "desc",
          },
        });

        const routines = await prisma.userRoutine.findMany({
          where: {
            user_id: user.user_id,
          },
        });

        const matchingRoutines = routines.filter((routine) => {
          console.log("Routine weekdays:", routine.weekdays);
          console.log("Routine period time:", routine.period_time);
          return (
            routine.weekdays.includes(dayOfWeek) &&
            routine.period_time.includes(current_period)
          );
        });

        console.log("Matching routines for user:", matchingRoutines);
        console.log("Current day of week:", dayOfWeek);
        console.log("Current time period:", current_period);

        if (matchingRoutines.length > 0) {
          for (const userRoutinesobj of matchingRoutines) {
            console.log(
              "Creating consumption entry for routine:",
              userRoutinesobj.routine_id
            );

            const { task, duration_routine } = userRoutinesobj;

            await prisma.consumptionHistory.create({
              data: {
                user: { connect: { user_id: user.user_id } },
                routine: {
                  connect: { routine_id: userRoutinesobj.routine_id },
                },
                consumption: duration_routine,
                consumption_date: new Date(),
                task_routine: task,
                house: { connect: { house_id: user.house_id } },
                type: 0,
                payment: lastPayment
                  ? { connect: { payment_id: lastPayment.payment_id } }
                  : undefined,
              },
            });
          }
        }
      }
    });

    res.json({ message: "Routines parsed successfully." });
  } catch (error) {
    console.error("Error executing transaction:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing routines." });
  }
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
