var userModel = require('../models/user');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/index', function(req, res, next) {
  res.render('index', { title: 'home' });
});


router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/sign-up', async function(req, res, next) {
  
  var existentUser = await userModel.findOne({ email:req.body.email });
  if (!existentUser) {
    
    var newuser = new userModel ({
      
      name: req.body.name,
      FirstName: req.body.FirstName,
      email: req.body.email ,
      password: req.body.password,
     });
     
     // We save our new user in our MongoDB
    var newUserSaved = await newuser.save();

    req.session.name = {name: newUserSaved.name, id: newUserSaved._id};
    req.session.FirstName = {name: newUserSaved.FirstName, id: newUserSaved._id};

     res.redirect('/users/index');
   
    }else {
      res.redirect('/users/login');
}

});

  router.post('/sign-in', async function(req, res, next) {

    var existentUser = await userModel.findOne({ email:req.body.email, password:req.body.password });
    
   
     if(existentUser) {

     req.session.user = { name: existentUser.name, id: existentUser._id };
  
      console.log("EXISTENT USER :", existentUser);
      res.redirect('/');
     
    } else {
      console.log("NOT EXISTENT USER :"+ existentUser);
      
      res.render('login');
    }

    });

    router


module.exports = router;
