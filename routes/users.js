var userModel = require('../models/user');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/index', function(req, res, next) {
  res.send('index');
});


router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/sign-up', async function(req, res, next) {
  
  var existentUser = await userModel.findOne({ email:req.body.email });
  if (!existentUser) {
    
    var newuser = new userModel ({
      username: req.body.username,
      email: req.body.email ,
      password: req.body.password,
     });
     
     // We save our new user in our MongoDB
    var newUserSaved = await newuser.save();

    req.session.username = {name: newUserSaved.username, id: newUserSaved._id};

     res.redirect('/users/index');
   
    }else {
      res.redirect('/users/login');
}

});

  router.post('/sign-in', async function(req, res, next) {

    var existentUser = await userModel.findOne({ email:req.body.email, password:req.body.password });
    
   
     if(existentUser) {

     req.session.user = { name: existentUser.username, id: existentUser._id };
  
      console.log("EXISTENT USER :", existentUser);
      res.redirect('/users/index');
     
    } else {
      console.log("NOT EXISTENT USER :"+ existentUser);
      
      res.render('login');
    }

    });

    router


module.exports = router;
