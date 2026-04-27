const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  console.log(req.body);
  res.redirect("/dashboard");
});

router.get("/logout", (req, res) => {
  res.render("logout");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { fullname, email, phonenumber, nin } = req.body;
    //Check if user already exists
    let existingUser = await Registration.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return res.render("signup", { error: "Email is already registered" });
    }
    //create a new email
    const newUser = new Registration({
      fullname,
      email: email.toLowerCase(),
      phonenumber,
      nin: nin.toUpperCase(),
    });
    console.log(newUser);
    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.render("signup", { error: error.message });
  }
});

module.exports = router;
