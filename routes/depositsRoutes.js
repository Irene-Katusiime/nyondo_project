const express = require('express');
const router = express.Router();
const Deposit = require("../models/Deposit");

router.get('/deposit', (req, res)=>{
    res.render('deposits')
})

router.post('/deposits', async (req ,res)=>{
  //  console.log(req.body);
  try {
    const {customername, NINnumber, phonenumber, amounttodeposit } = req.body;
    const phone = '+256' + phonenumber;

    const deposit = new Deposit({
      customername,
      NINnumber,
      phonenumber: phone,
      amounttodeposit
    });
    await deposit.save();

    res.redirect('/');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving deposit');
  }
 

});

module.exports = router;