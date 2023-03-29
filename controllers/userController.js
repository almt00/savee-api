const express = require("express");
const router = express.Router();

// users list route
router.get("/", function (req, res) {
  res.send("users list");
});

// user details route
router.get("/:id", function (req, res) {
  res.send(`user ${req.params.id} details`);
});

router.post('/', (req, res) => {
    let data = req.body;
    res.send('Data Received: ' + JSON.stringify(data));
})

module.exports = router;