const express = require("express");
const router = express.Router();

// house details route
router.get("/:house_id", function (req, res) {
  res.send(`house ${req.params.house_id} details`);
});

router.post('/', (req, res) => {
    let data = req.body;
    res.send('house added: ' + JSON.stringify(data));
})

router.put('/:house_id', (req, res) => {
  let data = req.body;
  res.send('house info added: ' + JSON.stringify(data));
})

router.get('/:house_id/consumption', (req, res) => {
  res.send('house consumption details ');
})

router.get('/:house_id/payment', (req, res) => {
  res.send('house payments details ');
})

router.get('/:house_id/payment/:payment_id', (req, res) => { //isto mete-se assim??
  res.send(`house ${req.params.house_id}, ${req.params.payment_id}º payment details `);
})

router.post('/:house_id/payment', (req, res) => {
  let data = req.body;
  res.send('house payment added: '+ JSON.stringify(data));
})

module.exports = router;