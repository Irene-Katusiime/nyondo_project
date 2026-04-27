const express = require('express');
const router = express.Router();

router.get('/deposit', (req, res)=>{
    res.render('deposits')
})

router.post('/deposits',(req ,res)=>{
  console.log(req.body)
});

module.exports = router;