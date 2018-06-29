var express = require('express');
var app = module.exports = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('../config/database');
var User = require('../user.js');
var jwt = require('jsonwebtoken');
var final_text = '';

mongoose.connect(config.database);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(callback){
    console.log('connection succeeded');
});

app.use(bodyParser.text());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
  extended: true
}));

app.start = function(){
    app.post('/api/token', app.__setToken);
    app.post('/api/justify', app.__setText);
    app.get('/api/justify', app.__getText);

    console.log('Serveur écoute le port 8085...');
    app.listen(8085);
};

app.__setToken = function(req, res){
    if(req.body.email){
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
                return res.json('User not saved');
            }
            else {
                console.log('user saved');
                return res.json(user);
            }
        });
    }
    else {
        return res.json('Enter your email');
    }
}

app.__setText = function(req, res){
    if(req.headers.email && req.headers.token){
        User.findOne({email: req.headers.email, token: req.headers.token})
        .exec(function(err,doc){
            if(doc){
                if(req.body){
                    var date = new Date();
                    var month = date.getUTCMonth() + 1;
                    var day = date.getUTCDate();
                    var year = date.getUTCFullYear();

                    newdate = year + "/" + month + "/" + day;

                    if(doc.date != newdate){
                        doc.count_words = 0;
                        doc.date = newdate;
                    }
                    if(doc.count_words === 80000){
                        return res.status(402).send('Payment Required');
                    }
                    else {
                        var text = req.body;
                        var array = text.match(/.{1,80}/g);
                        final_text = '';

                        var words = text.split(' ');
                        var count = words.length;
                        var inbetween = 80000 - doc.count_words;
                        if(count > inbetween){
                            return res.json('Only '+ inbetween +' words left for this day');
                        }
                        else {
                            var update = doc.count_words + count;
                            doc.count_words = update;
                            doc.save();

                            array.forEach(function(data){
                                final_text += data + '\n';
                            });
                            
                            return res.json(final_text);
                        }
                    }
                }
                else {
                    return res.json('No text sent');
                }
            }
            else {
                return res.json('User not found');
            }
        });
    }
    else {
        return res.json('Missing email and/or token in header');
    }
}

app.__getText = function(req, res){
   res.setHeader('content-type', 'text/plain');
   return res.send(final_text);
}