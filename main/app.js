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
    app.get('/api/justify', app.__getToken);
    app.post('/api/justify', app.__setText);

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

app.__getToken = function(req, res){
    User.findOne({email: req.body.email}) 
    .exec(function(err,doc) {
        if(doc) {
            
        }
        else {
            return;
        }
    });
}

app.__setText = function(req, res){
    if(req.body.text){
        var text = req.body.text;
        var array = text.match(/.{1,80}/g);
        var final_text = '';
        console.log(array[0].length);

        array.forEach(function(data){
            final_text += data + '\n';
        });
        console.log(final_text);

        return res.json(final_text);
    }
    else {
        console.log('echec');
    }
}