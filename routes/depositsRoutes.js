const express = require('express');
const router = express.Router();
const Deposit = require("../models/Deposit");

const {isAttendant,isAdmin, isManager} = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/auth');
const { authorize } = require('passport');
const Sale = require('../models/Sale');

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

    const subtotal = price * qty;
    // const balance = total - paid;

    const count = await Deposit.countDocuments();

    const needsTransport = req.body.needsTransport;

    //Transport calculation

    let transportcost = 0;
    if(needsTransport === 'no'){
      transportcost = 0;
    } else {
     if (subtotal >= 500000 && Number(distance)<= 10){
      transportcost = 0
     }else{
      transportcost = 30000
     }
    }

     const grandTotal = subtotal + transportcost;
     const balance = grandTotal - paid

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;


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
      needsTransport : req.body.hasTransport ? true : false,
      transportcost,
      subtotal,
      invoiceNumber,
      grandTotal,
      status: 'Pending',
      issuedBy: req.user._id
    });

    await deposit.save();

    res.redirect(`/deposits/receipt/${deposit._id}`);

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
    res.render('depositlist',{ deposits, totalPool });
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
    // const {customername,  amountdeposited,  quantity, itemprice} = req.body;
    const { newpayment } = req.body;
    const deposit = await Deposit.findById(req.params.id);

    const newPay = Number(newpayment || 0);
    const previousPaid = Number(deposit.amountdeposited || 0);

    const updatePaid = previousPaid + newPay;

    // //Convert to numbers
    const qty = Number(deposit.quantity);
    const price = Number(deposit.itemprice);
    // // const paid = Number(amountdeposited);

    // //Recalculate balance
    const total = qty * price;
    let balance = total - updatePaid;

    // //Prevent negative balances
    if(balance < 0) {
      balance = 0;
    }

    //Automatically determine status
    let status = 'Pending'
    if (balance <= 0){
      status = 'Paid';
    }else if (updatePaid > 0) {
      status = 'Partial';
    }

    await Deposit.findByIdAndUpdate(req.params.id,{
      customername: deposit.customername,
      quantity: deposit.quantity,
      itemprice: deposit.itemprice,
      itemname: deposit.itemname,
      amountdeposited: updatePaid,
      balance,
      status
  });
  res.redirect(`/deposits/receipt/${deposit._id}`);
}catch(error){
  console.error(error);
  res.status(500).send('Update error');
}
});

//View and print receipt
router.get('/deposits/receipt/:id', async (req,res) => {
  try {
    const deposit = await Deposit.findById(req.params.id)
    .populate('issuedBy', 'fullname');

    const adminName = deposit.issuedBy ? deposit.issuedBy.fullname : 'Admin';

    if(!deposit){
      return res.status(404).send('Receipt not found');
    }
    res.render('depositreceipts', {deposit,adminName});

  } catch (error) {
    console.error(error)
     res.status(400).send('Unable to view receipt')
  }
});

module.exports = router;