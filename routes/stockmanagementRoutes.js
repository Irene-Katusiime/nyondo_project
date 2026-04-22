const express = require('express');
const router = express.Router();

router.get('/stockmanagement', (req, res)=>{
    res.render('stockmanagement')
})

router.post('/stockmanagement',(req ,res)=>{
  console.log(req.body)
});


module.exports = router;