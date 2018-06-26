var expect = require('chai').expect;
var sinon = require('sinon');

describe('app', function(){

    var app;

    beforeEach(function(){
        app = require('../main/app');
    });

    describe('start', function(){

        it('expect start app', function(){
            app.listen = sinon.spy();

            app.start();

            expect(app.listen.calledWith(8085)).to.be.true;
        });

        it('expect return voitures', function(){
            app.get = sinon.spy();

            app.start();

            expect(app.get.calledWith('/voitures', app.__getVoitures)).to.be.true;
        });
    });

    describe('__getVoitures', function(){
        it('expect return voitures', function(){
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
            var request = {};
            var response = {
                send: sinon.spy()
            };

            app.__getVoitures(request, response);

            expect(response.send.calledWith(voitures)).to.be.true;
        });
    });

});