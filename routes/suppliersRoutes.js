const express = require('express');
const router = express.Router();

router.get('/suppliersform', (req, res)=>{
    res.render('suppliers')
})

router.post('/suppliers',(req ,res)=>{
  console.log(req.body)
});

module.exports = router;