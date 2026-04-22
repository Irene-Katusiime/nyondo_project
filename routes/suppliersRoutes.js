const express = require('express');
const router = express.Router();

router.get('/suppliers', (req, res)=>{
    res.render('suppliers')
})

router.post('/stockmanagement',(req ,res)=>{
  console.log(req.body)
});

module.exports = router;