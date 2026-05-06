const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');

// const Stock = require('../models/Stock');
// const {isAttendant,isAdmin, isManager} = require('../middleware/auth');


router.get('/stockreg', (req, res)=>{
    res.render('stockmanagement')
})

router.post('/stockreg', async(req ,res)=>{
  console.log(req.body);
  try {
    const {itemName,category,quantity,unitprice,sellingprice,suppliername,suppliercontact} =req.body
    const total = parseInt(quantity)*parseFloat(unitprice);
    let newItem = new Stock({
      itemName,
      category,
      quantity,
      unitprice,
      sellingprice,
      suppliername,
      suppliercontact,
      total
    })

    console.log(newItem)
    await newItem.save();
    res.redirect('/')
  } catch (error) {
    res.render('stockmanagement',{error:error.message}) 
    console.error(error)
  }
});


module.exports = router;