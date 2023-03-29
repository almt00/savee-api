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
    res.send('user added: ' + JSON.stringify(data));
})

router.put('/:id', (req, res) => {
  let data = req.body;
  res.send('user info added: ' + JSON.stringify(data));
})

router.delete('/:id', (req, res) => {
  let data = req.body;
  res.send('user deleted ' + JSON.stringify(data));
})


module.exports = router;