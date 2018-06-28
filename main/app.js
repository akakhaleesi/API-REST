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
    app.post('/api/justify', app.__setText);

    console.log('Serveur écoute le port 8085...');
    app.listen(8085);
};

app.__setToken = function(req, res){
    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    var date = new Date();
    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate();
    var year = date.getUTCFullYear();

    var newdate = year + "/" + month + "/" + day;

    var user = new User({
        email: req.body.email,
        token: token,
        count_words: 0,
        date: newdate
    });
    user.save(function(error){
        if(error){
            console.error(error);
            return;
        }
        else {
            console.log('user saved');
        }
    });
    return res.json(user);
}

app.__setText = function(req, res){
    User.findOne({email: req.body.email, token: req.body.token})
    .exec(function(err,doc){
        if(doc){
            if(req.body.text){

                var date = new Date();
                var month = date.getUTCMonth() + 1;
                var day = date.getUTCDate();
                var year = date.getUTCFullYear();

                newdate = year + "/" + month + "/" + day;

                if(doc.date != newdate){
                    doc.count_words = 0;
                    doc.date = newdate;
                }

                var text = req.body.text;
                var array = text.match(/.{1,80}/g);
                var final_text = '';

                var words = text.split(' ');
                var count = words.length;
                var update = doc.count_words + count;
                console.log(newdate);
                console.log(update);
                doc.count_words = update;
                doc.save();

                array.forEach(function(data){
                    final_text += data + '\n';
                });
                return res.json(final_text);
            }
            else {
                console.log('echec');
                return;
            }
        }
        else {
            return;
        }
    });
}