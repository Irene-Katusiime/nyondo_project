const express = require('express');
const router = express.Router();

router.get('/transportation', (req, res)=>{
    res.render('transport')
})

router.post('/transport',(req ,res)=>{
  console.log(req.body)
});


module.exports = router;