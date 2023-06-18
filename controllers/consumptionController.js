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

router.post("/user/all", authenticate, async function (req, res) {
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
            routine.period_time === current_period
          );
        });

        if (matchingRoutines.length > 0) {
          for (const routine of matchingRoutines) {
            console.log(
              "Creating consumption entry for routine:",
              routine.routine_id
            );

            const { routine_id, duration_routine, task, house_id } = routine;

            await prisma.consumptionHistory.create({
              data: {
                user: { connect: { user_id: user.user_id } },
                routine: routine
                  ? { connect: { routine_id: routine.routine_id } }
                  : undefined,
                consumption: duration_routine,
                consumption_date: new Date(),
                task: { connect: { task: task } },
                house: { connect: { house_id: house_id } },
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
