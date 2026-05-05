const express = require('express');
const router = express.Router();

router.get('/admindashboard', (req, res)=>{
    res.render('admindashboard')
});
router.get('/attendantdashboard', (req, res)=>{
    res.render('salesdashboard')
});
router.get('/storemanagerdashboard', (req, res)=>{
    res.render('managerdashboard')
});

module.exports = router;

