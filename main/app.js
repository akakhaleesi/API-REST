var express = require('express');
var app = module.exports = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('../config/database');
var User = require('../user.js');
var jwt = require('jsonwebtoken');

mongoose.connect(config.database);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(callback){
    console.log('connection succeeded');
});

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
    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    var data = [
        {
            email: req.body.email,
            token: token
        }
    ];
    var user = new User({
        email: req.body.email,
        token: token
    });
    user.save(function(error){
        if(error){
            console.error(error);
        }
        else {
            console.log('user saved');
        }
    });
    res.json(user);
}