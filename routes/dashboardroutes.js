const express = require('express');
const router = express.Router();
const Deposit = require('../models/Deposit'); //Importing the deposit model

router.get('/admindashboard', async(req, res)=>{
    try {
        //Fetch the 5 most recent deposits
        const deposits = await Deposit.find()
            .sort({ date: -1})
            .limit(5);

        // Send deposits to the admin view
        res.render('admin', { deposits });
    } catch (error) {
        console.error('Error fetching deposits:', error);
        res.status(500).send('Server Error')
    }
    // res.render('admin', { deposits: []});
});
// router.get('/attendantdashboard', (req, res)=>{
//     res.render('salesdashboard')
// });
router.get('/storemanagerdashboard', (req, res)=>{
    // res.render('managerdashboard')
    res.redirect('/stocklist')
});

module.exports = router;

