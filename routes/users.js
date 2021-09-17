const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth')

// login page
router.get("/login",(req,res)=>{
    res.render('login');
});
// register page
router.get("/register",(req,res)=>{
    res.render('register')
});

//Dashboard page
router.get("/dashboard",ensureAuthenticated, (req,res)=>{
  res.render('dashboard')
  
});

//User model
const User =  require('../models/User')

//body-parser
router.use(bodyParser.urlencoded({ extended: false }));



//register post
router.post('/register',(req,res)=>{
    const { name, email, password, password2 } = req.body;
    
    let errors = [];
  
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if(errors.length > 0){
        res.render('register',{
           errors,name,email,password,password2
        })
    }else{
      User.findOne({email:email}).then(
        (user)=>{
          if(user){
          errors.push({msg:'email already registered'});
          res.render('register',{
            errors,name,email,password,password2
         })
        }else{

          const newUser = new User({
            name:name,
            email:email,
            password:password
          })
          // Store hash in your password DB.
        
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                  req.flash('success_msg','your are now registered and can log in')
                    res.redirect('/users/login');
                  })
                  .catch(err => console.log(err));
              });
            });
        
         
          
          
        }

        }
      )

    }

   
});


//log in post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});
// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;
