 //1.Dependencies
 const express = require('express');
 const expressSession = require('express-session')
 const path  = require('path')

 //2.Instantiations
const app = express();
const port = 3000;

//3.Configurations
//Set templating engine to pug
app.set("view engine","pug");
app.set("views", path.join(__dirname, "views"))


//4.Middleware
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: false }));
app.use(expressSession({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}))

//5.Routes
// app.use('/',require('./routes/indexRoutes'))
app.use('/',require('./routes/dashboardRoutes'))
app.use('/',require('./routes/depositsRoutes'))
app.use('/',require('./routes/indexRoutes'))
app.use('/',require('./routes/loginRoutes'))
app.use('/',require('./routes/salesRoutes'))
app.use('/',require('./routes/logoutRoutes'))
app.use('/',require('./routes/signupRoutes'))
app.use('/',require('./routes/stockmanagementRoutes'))
app.use('/',require('./routes/suppliersRoutes'))
app.use('/',require('./routes/transportRoutes'))

//This is the second last chunk of code
//Handling non-existing routes
app.use((req,res) =>{
  res.status(404).send('Oops!Route not found.');
});

//6.Bootstrapping Server
//Last line of code in this file
app.listen(port, () => console.log(`listening on port ${port}`));

