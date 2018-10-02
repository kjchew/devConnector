module.exports = {
    mongoURI: process.env.MONGO_URI || "mongodb://chewkj:Pass1234@ds145415.mlab.com:45415/heroku_mpg78m2n",
    // mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/devConnect",
    secretOrKey: process.env.SECRET_OR_KEY
  };