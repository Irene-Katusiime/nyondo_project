const express = require('express');
const router = express.Router();
const Deposit = require("../models/Deposit");

const {isAttendant,isAdmin, isManager} = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/auth');
const { authorize } = require('passport');

router.get('/deposit', isAdmin,async(req, res)=>{
    res.render('deposits')
})

router.post('/deposits', isAdmin, async (req ,res)=>{
  //  console.log(req.body);
  try {
    const {customername, NINnumber, phonenumber, amountdeposited, itemname, quantity, itemprice, status, customeraddress, distance } = req.body;

    const phone = '+256' + phonenumber; 


    const qty = Number(quantity);
    const price = Number(itemprice);
    const paid = Number(amountdeposited);

    const total = price * qty;
    const balance = total - paid;


    const deposit = new Deposit({
      customername,
      NINnumber,
      phonenumber: phone,
      amountdeposited: Number(amountdeposited),
      itemname,
      quantity: Number(quantity),
      itemprice: Number(itemprice),
      balance,
      customeraddress,
      distance,
      status: 'Pending'
    });

    await deposit.save();

    res.redirect('/credit');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving deposit');
  }
 

});

//Route to display the deposit list page
router.get('/credit', isAdmin,async(req,res) => {
  try {
    //Fetch all deposits from Mongodb
    const deposits = await Deposit.find().sort({ date: -1});

    //Calculte total amount deposited
    const totalPool = deposits.reduce((sum, deposit) => {
      return sum + Number(deposit.amountdeposited || 0);
    }, 0);

    //Render deposits.pug
    res.render('depositlist', { deposits, totalPool });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading deposits');
  }
});

//The edit route
router.get('/deposit/edit/:id', async(req,res) => {
  try{
  const deposit = await Deposit.findById(req.params.id);
  if(!deposit) return res.status(404).send('Deposit not found');

  res.render('editdeposit', {deposit});
  }catch (error){
    console.error(error);
    res.status(500).send('Error loading edit page');
   }
});

router.post('/deposit/update/:id', async(req,res) => {
  try{
    const {customername,  amountdeposited,  quantity, itemprice, balance} = req.body;

    await Deposit.findByIdAndUpdate(req.params.id,{
      customername,
      quantity,
      itemprice,
      amountdeposited,
      balance
  });
  res.redirect('/admindashboard');
}catch(error){
  console.error(error);
  res.status(500).send('Update error');
}
});

module.exports = router;