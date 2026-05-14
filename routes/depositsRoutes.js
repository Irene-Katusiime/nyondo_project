const express = require('express');
const router = express.Router();
const Deposit = require("../models/Deposit");

const {isAttendant,isAdmin, isManager} = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/auth');

router.get('/deposit', isAttendant,async(req, res)=>{
    res.render('deposits')
})

router.post('/deposits', isAttendant, async (req ,res)=>{
  //  console.log(req.body);
  try {
    const {customername, NINnumber, phonenumber, amounttodeposit, itemname, quantity } = req.body;
    const phone = '+256' + phonenumber;

    const deposit = new Deposit({
      customername,
      NINnumber,
      phonenumber: phone,
      amounttodeposit,
      itemname,
      quantity
    });
    await deposit.save();

    res.redirect('/');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving deposit');
  }
 

});

//Route to display the deposit list page
router.get('/credit', isAttendant,async(req,res) => {
  try {
    //Fetch all deposits from Mongodb
    const deposits = await Deposit.find().sort({ date: -1});

    //Render deposits.pug
    res.render('depositlist', { deposits });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading deposits');
  }
});

module.exports = router;