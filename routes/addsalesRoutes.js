const express = require('express');
const router = express.Router();
const Sale = require("../models/Sale");

router.get('/salesform', (req, res)=>{
  try {
    const items = await Stock.find({ quantity: { $gt: 0}});
    console.log(items)
    res.render('addsales',{items})
  } catch (error) {
    res.status(500).send('server error');
    console.error('error', error.message);
  }
});

router.post('/salesform',(req ,res)=>{
  console.log(req.body)
});

//Get sales from the db
router.get('/salesList', async(req, res) =>{
  try {
    const sales = await Sale.find()
      .populate('itemname','itemName category')
      .populate('attendant','fullname')
      .sort({date:-1})
       res.render('sales-list',{sales});
  } catch (error) {
    console.error(error)
    res.status(400).send('Unable to pick sales from the db')
  }
});




module.exports = router;