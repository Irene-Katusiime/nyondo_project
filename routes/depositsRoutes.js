const express = require('express');
const router = express.Router();

router.get('/deposit', (req, res)=>{
    res.render('deposits')
})

router.post('/deposits',(req ,res)=>{
  console.log(req.body);
  try {
    const {customername, NINnumber, phonenumber, amounttodeposit } =req.body;

    const phone = '+256' + phonenumber;

    
  } catch (error) {
    
  }
 

});

module.exports = router;