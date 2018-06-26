var express = require('express');
var app = module.exports = express();

app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(express.static('public'));

app.start = function(){
    app.get('/voitures', app.__getVoitures);

    app.get('/api/token', app.__getToken);

    console.log('Serveur écoute le port 8085...');
    app.listen(8085);
};

app.__getVoitures = function(request, response){
    var voitures = [
        {
            nom: 'clio',
            marque: 'Renault'
        },
        {
            nom: '206',
            marque: 'Peugeot'
        }
    ];
    return response.send(voitures);
};

app.__getToken = function(req, res){
	res.render('index');
}