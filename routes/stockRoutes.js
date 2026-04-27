const express = require('express');
const router = express.Router();

router.get('/stockreg', (req, res)=>{
    res.render('stockmanagement')
})

router.post('/stockreg',(req ,res)=>{
  console.log(req.body)
});


module.exports = router;