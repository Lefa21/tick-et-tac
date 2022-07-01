const mongoose = require('mongoose');

var journeyModel = require('../models/journey.js');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51LBaXhITvZ1Ii0ZYP39WvMvRCGvgLx7lNkABtpFdkLWAvP4RtGkHmFcWnbtUKyepANj15pOOBhPKJtlUpYtXYaxW00qY0mj79P');

var express = require('express');
var router = express.Router();


// useNewUrlParser ;)


var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2022-07-01","2022-07-02","2022-07-03","2022-07-05","2022-07-04","2022-06-22","2022-06-25","2022-06-27","2022-06-30"]



/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user == undefined) {
    res.redirect('/users/login')
  }
  if (req.session.dataCard == undefined) {
    req.session.dataCard = []
  }
  res.render('index', { title: 'Express' });
});

router.get('/myChart', function(req, res, next) {
  if (req.session.user == undefined) {
    res.redirect('/users/login')
  }

var alreadyExist = false ;
if (req.session.dataCard == undefined) {
  req.session.dataCard = []
}
  for ( let i = 0 ; i<req.session.dataCard.length ; i++) {
    if (req.session.dataCard[i].journey == req.query.from+"/"+req.query.to) {
      req.session.dataCard[i].quantité = Number(req.session.dataCard[i].quantité) + 1
    
      alreadyExist = true;
    } }
  if(alreadyExist == false){
    var travel = {}
    travel.journey = req.query.from+"/"+req.query.to
    travel.departure = req.query.departure
    travel.date = req.query.date
    travel.price = req.query.price
    travel.quantité = 1

      req.session.dataCard.push(travel)
     } 
  
  res.render('myChart', { title: 'My Tickets' , dataCard: req.session.dataCard});
});

router.get('/delete-shop', function(req, res, next) {
  req.session.dataCard.splice(req.query.position,1)
  res.render('myChart', {title: "updated card", dataCard : req.session.dataCard});
});

router.post('/update-shop', function(req, res, next) {
  console.log(req.session.dataCard[0])
  console.log(req.body)
  req.session.dataCard[Number(req.body.button)].quantité= req.body.quantity
  
  res.render('myChart', {title: "updated card", dataCard : req.session.dataCard});
});

router.post('/create-checkout-session', async (req, res) => {
  let stripe_card_items =[]
  let session;
 console.log(req.session.dataCard[0])

 for (let i = 0 ; i < req.session.dataCard.length ; i++) {
  let article ={
    price_data : {
        currency : 'eur',
        product_data: { 
            name :  req.session.dataCard[i].journey,
        },
        unit_amount : req.session.dataCard[i].price*100,
        },
    quantity : req.session.dataCard[i].quantité,
   }
  stripe_card_items.push(article)
  req.session.user.trips.push({
      departure: req.session.dataCard[i].journey,
      departureTime : req.session.dataCard[i].departure,
      price: req.session.dataCard[i].price,
      date: req.session.dataCard[i].date,
  
 })
 }
console.log(req.session.user)
 var total = 0
 for (let j=0 ; j<stripe_card_items.length ; j++) {
  total += stripe_card_items[j].price_data.unit_amount*stripe_card_items[j].quantity
 }
  session = await stripe.checkout.sessions.create({

   payment_method_types: ['card'],
   
   
   line_items : stripe_card_items,
   mode : 'payment',
   success_url: 'http://localhost:3000/myTrips',
   cancel_url: 'http://localhost:3000/',
 }) 
 res.redirect(303, session.url);
});

// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});


router.post('/search', async function(req, res, next){
//if (req.session.user == undefined) {
  //  res.redirect('/users/login')
  //}
  var from = req.body.from
  var to = req.body.To
  var dateJ = req.body.date

  var journeys = await journeyModel.find({ $and: [ {departure : from}, {arrival: to}, {date : dateJ}]})
  console.log(journeys)
  if (journeys.length >= 1) {res.render('results', {title: "results", journeys, dateJ, from, to})
    
  } else {res.render('noresults', {title: "noresults", journeys, dateJ, from, to})}
})

router.get('/result', function(req, res, next) {

  res.render('game')
})
module.exports = router;
