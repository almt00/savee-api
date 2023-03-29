const express = require("express");
const router = express.Router();

// house details route
router.get("/:id", function (req, res) {
  res.send(`house ${req.params.id} details`);
});

router.post('/', (req, res) => {
    let data = req.body;
    res.send('house added: ' + JSON.stringify(data));
})

router.put('/:id', (req, res) => {
  let data = req.body;
  res.send('house info added: ' + JSON.stringify(data));
})

router.get('/:id/consumption', (req, res) => {
  let data = req.body;
  res.send('house consumption details ');
})

router.get('/:id/payment', (req, res) => {
  let data = req.body;
  res.send('house payments details ');
})

router.get('/:id/payment/:id', (req, res) => { //isto mete-se assim??
  let data = req.body;
  res.send(`house's ${req.params.id}º payment details `);
})

router.post('/:id/payment', (req, res) => {
  let data = req.body;
  res.send('house payment added: '+ JSON.stringify(data));
})

module.exports = router;