const express = require("express");
const prisma = require("../lib/prisma.js");
const router = express.Router();
const consumptionController = require("./consumptionController.js");

// users list route
router.get("/", async function (req, res) {
  const users = await prisma.user.findMany();
  res.json(users);
});

// user details route
router.get("/:user_id", async function (req, res) {
  const { user_id } = req.params;
  const user = await prisma.user.findFirst({
    where: {
      user_id: parseInt(user_id),
    },
  });
  res.json(user);
});

// add user to DB
router.post("/", async (req, res) => {
  const {
    first_name,
    last_name,
    username,
    password_hash,
    email,
    creation_date,
    house_id,
    ref_avatar,
  } = req.body;

  await prisma.user.create({
    data: {
      first_name: first_name,
      last_name: last_name,
      username: username,
      password_hash: password_hash,
      email: email,
      creation_date: new Date(creation_date),
      house_id: house_id,
      ref_avatar: ref_avatar,
    },
  });
});

//update user info
router.put("/:user_id", (req, res) => {
  let data = req.body;
  res.send("user info added: " + JSON.stringify(data));
});

router.delete("/:user_id", (req, res) => {
  let data = req.body;
  res.send("user deleted " + JSON.stringify(data));
});

router.get("/:user_id/task", async function (req, res) {
  const { user_id } = req.params;
  const tasks = await prisma.userTask.findMany({
    where: {
      user_id: parseInt(user_id),
    },
  });
  res.json(tasks);
  console.log(tasks);
});

router.post("/:user_id/task", async function (req, res) {
  const { user_id } = req.params;
  const { start_time, end_time, duration, task_id } = req.body;
  await prisma.userTask.create({
    data: {
      user_id: parseInt(user_id),
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      duration: parseInt(duration), // isto vai ser calculado aqui ou no frontend?
      task_id: task_id,
    },
  });
});

router.get("/:user_id/task/:task_id", async function (req, res) {
  const { user_id, task_id } = req.params;
  const task = await prisma.userTask.findFirst({
    where: {
      user_id: parseInt(user_id),
      task_id: parseInt(task_id),
    },
  });
  res.json(task);
});

router.delete("/:user_id/task/:task_id", (req, res) => {
  let data = req.body;
  res.send(`task ${req.params.task_id} deleted ` + JSON.stringify(data));
});

router.get("/:user_id/routine", async function (req, res) {
  const { user_id } = req.params;
  const routines = await prisma.userRoutine.findMany({
    where: {
      user_id: parseInt(user_id),
    },
  });
  res.json(routines);
});

router.get("/:user_id/routine/:routine_id", async function (req, res) {
  const { user_id, routine_id } = req.params;
  const routine = await prisma.userRoutine.findFirst({
    where: {
      user_id: parseInt(user_id),
      routine_id: parseInt(routine_id),
    },
  });
  res.json(routine);
});

router.post("/:user_id/routine", async function (req, res) {
  const { user_id } = req.params;
  const { duration_routine, creation_routine, task_id, weekdays, period_time } =
    req.body;
  await prisma.userRoutine.create({
    data: {
      user_id: parseInt(user_id),
      duration_routine: parseInt(duration_routine), // em segundos
      creation_routine: new Date(creation_routine),
      task: task_id,
      weekdays: weekdays,
      period_time: period_time,
    },
  });
});

router.put("/:user_id/routine/:routine_id", function (req, res) {
  let data = req.body;
  res.send(
    `user's ${req.params.routine_id}º routine updated: ${JSON.stringify(data)}`
  );
});

router.delete("/:user_id/routine/:routine_id", (req, res) => {
  let data = req.body;
  res.send(`routine ${req.params.routine_id} deleted ` + JSON.stringify(data));
});

router.get("/:user_id/payment", async function (req, res) {
  const { user_id } = req.params;
  const payments = await prisma.userPayment.findMany({
    where: {
      user_id: parseInt(user_id),
    },
    orderBy: {
      payment: {
        date_payment: "desc",
      },
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
  res.json(payments);
});

router.get("/:user_id/payment/date_payment", async function (req, res) {
  const { user_id } = req.params;
  const date_payment = await prisma.userPayment.findFirst({
    where: {
      user_id: parseInt(user_id),
    },
    orderBy: {
      payment: {
        date_payment: "desc",
      },
    },
    include: {
      payment: {
        select: {
          date_payment: true,
        },
      },
    },
  });
  res.json(date_payment);
});

router.get("/:user_id/payment/:payment_id", async function (req, res) {
  const { user_id, payment_id } = req.params;
  const payment = await prisma.userPayment.findFirst({
    where: {
      user_id: parseInt(user_id),
      payment_id: parseInt(payment_id), // aqui não tenho a crtz se é pelo id de pagamento referente (casa) ou pelo id do pagamento nesta tabela
    },
  });
  res.json(payment);
});

router.get("/:user_id/payment/:payment_id/insights", async function (req, res) {
  const { user_id, payment_id } = req.params;
  const user_consumption = await prisma.consumptionHistory.findMany({
    where: {
      user_id: parseInt(user_id),
    },
    include: {
      task: {
        select: {
          task: true,
          start_time: true,
          end_time: true,
        },
      },
      routine: {
        select: {
          duration_routine: true,
          task: true,
        },
      },
    },
  });

  let consumption = [];
  if (user_consumption) {
    consumption = user_consumption.filter(
      (consumption) => consumption.payment_id === parseInt(payment_id)
    );
  }

  const payment = await prisma.userPayment.findFirst({
    where: {
      user_id: parseInt(user_id),
      payment_id: parseInt(payment_id),
    },
  });

  const insights = {
    payment: payment,
    consumption: consumption,
  };

  res.json(insights);
});

module.exports = router;
