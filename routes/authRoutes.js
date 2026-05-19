const express = require("express");
const router = express.Router();
const passport = require('passport');

const {isAttendant,isAdmin, isManager} = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/auth');


//Importing a model
const Registration = require("../models/Registration");

//Signup route
router.get("/signup",isAdmin,async(req, res) => {
  res.render("signup");
});

router.post("/signup",isAdmin,async (req, res) => {
  try {
    const { fullname, email, phonenumber, role, nin } = req.body;

    const ninRegex = /^[A-Z]{2}\d{9}[A-Z]{4}$/;
    const formattedNin = nin?.toUpperCase().trim();

    if (!ninRegex.test(formattedNin)){
      return res.render('signup',{
        error: 'Invalid NIN format'
      });
    }

    //Check if user already exists
    let existingUser = await Registration.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return res.render("signup", { 
        error: "Email is already registered" 
      });
    }

    const phone = '+256' + phonenumber;

    //create a new user
    const newUser = new Registration({
      fullname,
      email: email.toLowerCase(),
      phonenumber: phone,
      role,
      nin: formattedNin
    });
    console.log(newUser);

    await Registration.register(newUser,req.body.password);

    console.log("User registered successfully");

        
    return res.redirect("/admindashboard");

  } catch (error) {
    console.error(error);
    res.render("signup", { error: error.message });
  }
});

//Login route
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login",passport.authenticate('local',{failureRedirect:'/login'}), (req, res) => {
  if(req.user.role==='admin'){
    res.redirect('/admindashboard')
  }else if(req.user.role==='sales attendant'){
    res.redirect('/salesList')
  }else if(req.user.role==='store manager'){
    res.redirect('/storemanagerdashboard')
  }else{
    res.redirect('/')
  }
});

//Logout route
router.get("/logout", (req, res) => {
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    res.redirect('/')
  });
});

//Index route
router.get('/', (req,res)=>{
    res.render('index')
});


module.exports = router;
