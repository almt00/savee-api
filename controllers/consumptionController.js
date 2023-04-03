const express = require("express");
const router = express.Router();

router.get("(/consumption/user/:user_id)", function (req, res) {
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

router.get("/consumption/house/:house_id", (req, res) => {
  res.send([
    {
      consumption_id: 1,
      payment_id: 1,
      routine_id: 1,
      task_id: 1,
      consumption_date: "2022-12-01",
      consumption: 134,
      type: 2,
    },
    {
      consumption_id: 2,
      payment_id: 1,
      routine_id: 1,
      task_id: 1,
      consumption_date: "2022-12-01",
      consumption: 134,
      type: 2,
    },
  ]);
});

module.exports = router;
