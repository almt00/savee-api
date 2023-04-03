const express = require("express");
const router = express.Router();

// users list route
router.get("/", function (req, res) {
  res.send([
    {
      user_id: 1,
      first_name: "Pedro",
      last_name: "Silva",
      username: "pedro001",
      password_hash:
        "$2y$10$X3JmxLTV8lImnnTxtLmbp.E35W.jiHA2oRpkUM/o7wciNrtpsJ10q",
      email: "pedro001@gmail.com",
      creation_date: "2022-12-01",
      house_id: 1,
      ref_avatar: 1,
    },
    {
      user_id: 2,
      first_name: "Asdrubal",
      last_name: "Teixeira",
      username: "asdrublissimo",
      password_hash:
        "$2y$10$X3JmxLTV8lImnnTxtLmbp.E35W.jiHA2oRpkUM/o7wciNrtpsJ10q",
      email: "asdrublissimo@gmail.com",
      creation_date: "2023-01-02",
      house_id: 1,
      ref_avatar: 2,
    },
  ]);
});

// user details route
router.get("/:user_id", function (req, res) {
  res.send({
    user_id: `${req.params.user_id}`,
    first_name: "Pedro",
    last_name: "Silva",
    username: "pedro001",
    password_hash:
      "$2y$10$X3JmxLTV8lImnnTxtLmbp.E35W.jiHA2oRpkUM/o7wciNrtpsJ10q",
    email: "pedro001@gmail.com",
    creation_date: "2022-12-01",
    house_id: 1,
    ref_avatar: 1,
  });
});

router.post("/", (req, res) => {
  let data = req.body;
  res.send("user added: " + JSON.stringify(data));
});

router.put("/:user_id", (req, res) => {
  let data = req.body;
  res.send("user info added: " + JSON.stringify(data));
});

router.delete("/:user_id", (req, res) => {
  let data = req.body;
  res.send("user deleted " + JSON.stringify(data));
});

router.get("/:user_id/consumption", function (req, res) {
  res.send([
    {
      task_id: 1,
      start_time: "2022-12-01T00:00:00.000Z",
      end_time: "2022-12-01T00:30:00.000Z",
      duration: "30",
      ref_task_id: 2,
    },
    {
      task_id: 2,
      start_time: "2022-12-01T00:00:00.000Z",
      end_time: "2022-12-01T00:15:00.000Z",
      duration: "15",
      ref_task_id: 3,
    },
    {
      task_id: 3,
      start_time: "2022-12-01T00:00:00.000Z",
      end_time: "2022-12-01T00:30:00.000Z",
      duration: "25",
      ref_task_id: 1,
    },
    {
      task_id: 4,
      start_time: "2022-12-01T00:00:00.000Z",
      end_time: "2022-12-01T00:15:00.000Z",
      duration: "40",
      ref_task_id: 2,
    },
  ]);
});

router.get("/:user_id/task", function (req, res) {
  res.send([
    {
      task_id: 1,
      start_time: "2022-12-01T00:00:00.000Z",
      end_time: "2022-12-01T00:30:00.000Z",
      duration: "30",
      ref_task_id: 2,
    },
    {
      task_id: 2,
      start_time: "2022-12-01T00:00:00.000Z",
      end_time: "2022-12-01T00:15:00.000Z",
      duration: "15",
      ref_task_id: 3,
    },
  ]);
});

router.post("/:user_id/task", function (req, res) {
  let data = req.body;
  res.send("user task added: " + JSON.stringify(data));
});

router.get("/:user_id/task/:task_id", function (req, res) {
  res.send({
    task_id: `${req.params.task_id}`,
    start_time: "2022-12-01T00:00:00.000Z",
    end_time: "2022-12-01T00:30:00.000Z",
    duration: "30",
    ref_task_id: 2,
  });
});

router.delete("/:user_id/task/:task_id", (req, res) => {
  let data = req.body;
  res.send(`task ${req.params.task_id} deleted ` + JSON.stringify(data));
});

router.get("/:user_id/routine", function (req, res) {
  res.send([
    {
      routine_id: 1,
      user_id: `${req.params.user_id}`,
      duration_routine: 30,
      creation_routine: "2022-12-01",
      weekdays: [2, 3, 4],
      period_time: 1,
    },
    {
      routine_id: 2,
      user_id: `${req.params.user_id}`,
      duration_routine: 15,
      creation_routine: "2022-12-01",
      weekdays: [1, 2],
      period_time: 2,
    },
  ]);
});

router.get("/:user_id/routine/:routine_id", function (req, res) {
  res.send({
    routine_id: `${req.params.routine_id}`,
    user_id: `${req.params.user_id}`,
    duration_routine: 30,
    creation_routine: "2022-12-01",
    weekdays: [2, 3, 4],
    period_time: 1,
  });
});

router.post("/:user_id/routine", function (req, res) {
  let data = req.body;
  res.send("user routine added: " + JSON.stringify(data));
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

router.get("/:user_id/payment", function (req, res) {
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

router.get("/:user_id/payment/:payment_id", function (req, res) {
  res.send({
    payment_id: `${req.params.payment_id}`,
    date_payment: "2022-12-01",
    value_payment: 80,
    house_id: 1,
  });
});

module.exports = router;
