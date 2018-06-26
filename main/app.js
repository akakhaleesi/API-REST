var express = require('express');
var app = module.exports = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('../config/database');
var User = require('../user.js');

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
    //res.json({email:req.body.email});
    var data = [
        {
            email: req.body.email,
            token: 'toto'
        }
    ];
    var user = new User({
        email: data.email,
        token: data.token
    });
    user.save(function(error){
        console.log('user saved');
        if(error){
            console.error(error);
        }
    });
    res.json(user);
}