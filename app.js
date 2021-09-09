const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//DATABASE
require('./config/keys');

// //Passport Config
require('./config/passport')(passport);


//body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());


  // Connect flash
app.use(flash());


//Global variables
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
   
    next();
  });
 //ROUTES
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
//EJS
app.use(expressLayouts);
app.set('view engine','ejs')


const PORT = process.env.port || 3000;
app.listen(PORT,console.log(`server started on port ${PORT}`));