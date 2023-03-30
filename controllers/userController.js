const express = require("express");
const router = express.Router();

// users list route
router.get("/", function (req, res) {
  res.send("users list");
});

// user details route
router.get("/:user_id", function (req, res) {
  res.send(`user ${req.params.user_id} details`);
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
  res.send(`user ${req.params.user_id} consumption`);
});

router.get("/:user_id/task", function (req, res) {
  res.send(`user ${req.params.user_id} tasks`);
});

router.post("/:user_id/task", function (req, res) {
  let data = req.body;
  res.send("user task added: " + JSON.stringify(data));
});

router.get("/:user_id/task/:task_id", function (req, res) {
  res.send(`user ${req.params.user_id}, task ${req.params.task_id}`);
});

router.delete("/:user_id/task/:task_id", (req, res) => {
  let data = req.body;
  res.send(`task ${req.params.task_id} deleted ` + JSON.stringify(data));
});

router.get("/:user_id/routine", function (req, res) {
  res.send(`user's routines list`);
});

router.get("/:user_id/routine/:routine_id", function (req, res) {
  res.send(`user's ${req.params.routine_id}º routine`);
});

router.post("/:user_id/routine", function (req, res) {
  let data = req.body;
  res.send("user routine added: " + JSON.stringify(data));
});

router.put("/:user_id/routine/:routine_id", function (req, res) {
  let data = req.body;
  res.send(`user's ${req.params.routine_id}º routine updated: ${JSON.stringify(data)}`);
});

router.delete("/:user_id/routine/:routine_id", (req, res) => {
  let data = req.body;
  res.send(`routine ${req.params.routine_id} deleted ` + JSON.stringify(data));
});

router.get("/:user_id/payment", function (req, res) {
  res.send(`user's payment list`);
});

router.get("/:user_id/payment/:payment_id", function (req, res) {
  res.send(`user's ${req.params.payment_id}º payment`);
});

module.exports = router;
