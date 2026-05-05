const express = require("express");
const router = express.Router();
const passport = require('passport');

//Importing a model
const Registration = require("../models/Registration");

//Signup route
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { fullname, email, phonenumber, role,} = req.body;
    //Check if user already exists
    let existingUser = await Registration.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return res.render("signup", { 
        error: "Email is already registered" 
      });
    }
    //create a new user
    const newUser = new Registration({
      fullname,
      email: email.toLowerCase(),
      phonenumber,
      role
    });
    console.log(newUser);
    await Registration.register(newUser,req.body.password,(err)=>{
      if(err){
        return res.redirect('/signup')
      }
    });
    res.redirect("/login");
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
    res.redirect('/attendantdashboard')
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
