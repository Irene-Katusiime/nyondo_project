//Dependencies
const express = require('express');
const expressSession = require('express-session');
const path = require('path');


 //2.Instantiations
const app = express();
const port = 3000;

//3.Configurations

//4.Middleware

app.use(express.urlencoded({ extended: false }));
app.use(expressSession({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}))

//Important line for static files
app.use(express.static(path.join(__dirname,'public')));




app.get('/',(req ,res)=>{
  res.sendFile(__dirname + '/html/landingpage.html')
});

app.get('/dashboard',(req ,res)=>{
  res.sendFile(__dirname + '/html/dashboard.html')
});

app.get('/login',(req ,res)=>{
  res.sendFile(__dirname + '/html/login.html')
});

app.post('/login',(req ,res)=>{
 console.log(req.body)
});

// app.get('/',(req ,res)=>{
//   res.sendFile(__dirname + '/html/landingpage.html')
// });


//This is the second last chunk of code
//Handling non-existing routes
app.use((req,res) =>{
  res.status(404).send('Oops!Route not found.');  
});

//6.Bootstrapping Server
//Last line of code in this file
app.listen(port, () => console.log(`listening on port ${port}`));
