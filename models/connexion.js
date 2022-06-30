var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
   };
  
  // --------------------- BDD -----------------------------------------------------
  mongoose.connect('mongodb+srv://fael:bouslama@cluster0.xcokt.mongodb.net/tic-et-tac?retryWrites=true&w=majority',
     options,
     function(err) {
      if (err) {
        console.log(`error, failed to connect to the database because --> ${err}`);
      } else {
        console.info('*** Database Ticketac connection : Success ***');
      }
     }
  );