/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const Game = require('../utils/Game.js');
const NUM_OF_GAMES = 3;
const fs = require('fs');

let assetsFolder = 'src/assets/'
let actionNameList = [];
let actions = {};
try{
    actionNameList = JSON.parse(fs.readFileSync(assetsFolder+'actions/actions.json', 'utf8')).actions;
}catch(err){
    assetsFolder = 'public/assets/'
    actionNameList = JSON.parse(fs.readFileSync(assetsFolder+'actions/actions.json', 'utf8')).actions;
}
for(let actionName of actionNameList){
    actions[actionName] = require('../../'+assetsFolder+'actions/'+actionName+'.js');
}
delete actionNameList;

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
                if(game){
                    if(game.isPlayerInGame(socket.id)){
                        callback(res);
                    }else{
                        console.warn('Person accessed game data of a game they weren\'t in. It could be a bug or it could be a... HACKER???')
                    }
                }else{
                    console.warn('Person accessed game data of a game they weren\'t in. It could be a bug or it could be a... HACKER???')
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
        on('getGameData', function(res){
            console.log('Fetching tiles for game ' + game.id);
            let tileId = 0;
            game.board.forEach(function(tileData){
                socket.emit('setTile', JSON.stringify(tileData));
            });
            game.units.forEach(function(unitData){
                socket.emit('setUnit', JSON.stringify(unitData));
            });
        });
        on('requestAction', function(res){
            let data = JSON.parse(res);
            const TARGET = game.board[data.target];
            const SOURCE = game.units[data.source];
            const GAME = game;
            const action = actions[data.action];
            let isTagetInRange;
            if(SOURCE.card.action[data.action].hasNoRange){
                isTagetInRange = true;
            }else{
                isTagetInRange = SOURCE.checkIfInRange(TARGET, data.action);
            }
            let isValidAction = action.checkIfValidTarget(TARGET, SOURCE, GAME.board, GAME.units);
            console.log('a user is attempting to perform the action ' + data.action)
            if(isTagetInRange && isValidAction){
                action.useAction(TARGET, SOURCE, GAME);
            }else{
                console.log('that action was impossible');
                console.log('in range: ' + isTagetInRange);
                console.log('is valid: ' + isValidAction);
            }
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