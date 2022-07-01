const mongoose = require('mongoose');

var journeyModel = require('../models/journey.js');


var express = require('express');
var router = express.Router();


// useNewUrlParser ;)


var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2022-07-01","2022-07-02","2022-07-03","2022-07-05","2022-07-04"]



/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'Express' });
});

router.get('/myChart', function(req, res, next) {
console.log(req.query)
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
    console.log(travel)
      req.session.dataCard.push(travel)
     } 
  
  res.render('myChart', { title: 'My Tickets' , dataCard: req.session.dataCard});
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

  var from = req.body.from
  var to = req.body.To
  var dateJ = req.body.date

  var journeys = await journeyModel.find({ $and: [ {departure : from}, {arrival: to}, {date : dateJ}]})
  console.log(journeys)
  if (journeys.length >= 1) {res.render('results', {title: "results", journeys, dateJ, from, to})
    
  } else {res.render('noresults', {title: "noresults", journeys, dateJ, from, to})}
})

router.get('/trips', (req, res) => {
  res.render('lastrips')
});

module.exports = router;
