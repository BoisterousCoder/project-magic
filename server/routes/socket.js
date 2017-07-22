/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const Game = require('../game/Game.js');
const NUM_OF_GAMES = 10;

module.exports = function(io) {
    var games = []
    for(let i = 0; i < NUM_OF_GAMES; i++){
        games[i] = new Game(i, io);
    }
    var peopleConected = new Wrapper(0, function() {
        console.log('There are now ' + peopleConected.get() + ' people conected.');
    });

    io.on('connection', function(socket) {
        //connect to client
        peopleConected.set(peopleConected.get() + 1);
        let game;
        let on = function(title, callback){
            socket.on(title, function(res){
                if(game.isPlayerInGame(socket.id)){
                    callback(res);
                }
            });
        }

        socket.on('disconnect', function() {
            peopleConected.set(peopleConected.get() - 1);
            if(game){
                game.disconect(socket.id)
            }
        });
        socket.on('getGameListings', function() {
            games.forEach(function(game){
                let data = JSON.stringify(game.listing);
                socket.emit('makeGameListing', data);
            })
        });
        socket.on('joinGame', function(gameId){
            if(games[gameId].players.length < games[gameId].maxPlayers){
                game = games[gameId];
                console.log('sending to player to game ' + gameId);
                game.players.push({
                    socket:socket,
                    id:game.players.length
                });
                io.emit('updateGameListing', JSON.stringify(game.listing));
                socket.emit('joinGame', gameId);
            }else{ 
                socket.emit('alertUser', 'Game ' + (gameId+1) + ' is full with ' + games[gameId].players.length + '/' + games[gameId].maxPlayers + 'players');
            }
        });

        on('clickedTile', function(res) {
            console.log('You clicked tile ' + res);
            game.setTile(res, 'color', 'yellow');
        });
        on('getTiles', function(res){
            console.log('Fetching tiles for game ' + game.id);
            let tileId = 0;
            game.board.forEach(function(tileData){
                socket.emit('setTile', JSON.stringify(tileData));
            });
        });
    });
};

function Wrapper(value, callback) {
    this.value = value;
    this.callback = callback;
    this.set = function(newValue) {
        this.value = newValue;
        this.callback();
    };
    this.get = function() {
        return this.value;
    };
}