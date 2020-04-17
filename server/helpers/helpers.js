//const jwt = require('jsonwebtoken');
const config = require('../config.js');
const helpers = {};
let _serverPort = null;

/*
// Middleware 
helpers.limitAccessToAuthentificatedOnly = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Methodes permettant de set/get le sur lequel le serveur est lancé
helpers.setServerPort = (port=80) => { _serverPort = port; };
helpers.getServerPort = () => _serverPort;

helpers.getBaseURI = (req) => {
  return `${req.protocol}://${req.hostname}:${helpers.getServerPort()}`;
}

// Méthodes permettant de verifier le token
helpers.checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; 

  if (token) {
  	if (token.startsWith('Bearer ')) {
  	  token = token.slice(7, token.length);
  	}
  	
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

module.exports = helpers;
*/