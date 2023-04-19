const express = require("express");
const prisma = require("../lib/prisma.js");
const router = express.Router();

router.get("(/user/:user_id)", async function (req, res) {
  const { user_id } = req.params;
  const user_consumptions = await prisma.consumptionHistory.findMany({
    where: {
      user_id: parseInt(user_id),
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
