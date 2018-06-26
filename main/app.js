var express = require('express');
var app = module.exports = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/database');
var User = require('./user.js');

mongoose.connect(config.database);
var db = mongoose.connection;

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
  extended: true
}));

app.start = function(){
    app.post('/api/token', app.__setToken);

    console.log('Serveur écoute le port 8085...');
    app.listen(8085);
};

app.__setToken = function(req, res){
    //res.json({email:req.body.email});
    var user = [
        {
            email: req.body.email,
            token: 'toto'
        }
    ];
    res.json(user);
}