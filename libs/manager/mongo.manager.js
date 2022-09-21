const mongoose = require('mongoose');
const { mongoUrl } = require('../../config');

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
  });

mongoose.set('debug', true);

/**
* Connect to mongo db
*
* @returns {object} Mongoose connection
* @public
*/
exports.connect = () => {
    console.log("connecting to mongo db")
    mongoose.connect(mongoUrl, {
      // keepAlive: 1,
      // keepAlive: true,
      useNewUrlParser:true,
      useUnifiedTopology: true ,
      // socketTimeoutMS: 60000,
      maxpoolSize: 10
    });
    return mongoose.connection;
  };
  


