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
    let publicGames = [];
    let privateGames = {};
    for(let i = 0; i < NUM_OF_GAMES; i++){
        publicGames[i] = new Game(i, io);
    }
    let peopleConected = new Wrapper(0, function() {
        console.log('There are now ' + peopleConected.get() + ' people conected.');
    });
    function deletePrivateGame(gameId){
        console.log('deleting game ' + gameId);
        privateGames[gameId] = undefined;
    }

    io.on('connection', function(socket) {
        //connect to client
        peopleConected.set(peopleConected.get() + 1);
        let game;
        function on(title, callback, isGameRequired){
            socket.on(title, function(res){
                try{
                    if(game){
                        if(game.isPlayerInGame(socket.id)){
                            callback(res);
                        }else if(!isGameRequired){
                            callback(res);
                        }else{
                            console.warn('Person accessed game data of a game they weren\'t in that game.')
                        }
                    }else if(!isGameRequired){
                        callback(res);
                    }else{
                        console.warn('Person accessed game data of a game they weren\'t in that game.')
                    }
                }catch(err){
                    console.error(err);
                    socket.emit('serverError', 'An error has occured server side. This is probably a bug. Please file a bug report on this program\'s github page with the following text:\n\n' + err.stack);
                    callOnFunc(title, callback, isGameRequired);
                }
            });
        }
        function callOnFunc(title, callback, isGameRequired){
            on(title, callback, isGameRequired);
        }

        on('disconnect', function() {
            peopleConected.set(peopleConected.get() - 1);
            if(game){
                game.disconect(socket.id)
            }
        });
        on('getGameListings', function() {
            publicGames.map(function(game){
                let data = JSON.stringify(game.listing);
                socket.emit('makeGameListing', data);
            })
        });
        on('joinGame', function(gameId){
            let attemptedGame;
            if(publicGames[gameId]){
                attemptedGame = publicGames[gameId];
            }else if(privateGames[gameId]){
                attemptedGame = privateGames[gameId];
            }else{
                console.error('someone attempted to join a non existant game called ' + gameId);
                socket.emit('alertUser', 'There is no game with the id ' + gameId);
            }
            if(attemptedGame){
                if(attemptedGame.players.length < attemptedGame.maxPlayers){
                    game = attemptedGame;
                    game.players.push({
                        socket:socket,
                        id:game.players.length
                    });
                    io.emit('updateGameListing', JSON.stringify(game.listing));
                    socket.emit('joinGame', gameId)
                }else{ 
                    socket.emit('alertUser', attemptedGame.name + ' is full with ' + attemptedGame.players.length + '/' + attemptedGame.maxPlayers + 'players');
                }
            }
        });
        on('requestPrivateGame', function(gameName){
            if(gameName){
                console.log('creating private game ' + gameName);
                if(!privateGames[gameName]){
                    privateGames[gameName] = new Game(gameName, io);
                    privateGames[gameName].name = gameName;
                    socket.emit('confirmPrivateGame', gameName);
                    privateGames[gameName].destroyFunc = deletePrivateGame;
                }else{
                    socket.emit('confirmPrivateGame', gameName);
                }
                console.log('created private game ' + gameName);
            }else{
                socket.emit('alertUser', gameName + 'is not a valid name');
            }
        });

        on('clickedTile', function(res) {
            console.log('You clicked tile ' + res);
            game.setTile(res, 'color', 'yellow');
        }, true);
        on('getBase', function(res){
            let baseId = game.baseIds[game.getPlayer(socket.id).id];
            game.setUnitOwner(baseId, socket.id)
            console.log(game.units[baseId]);
        });
        on('getGameData', function(res){
            console.log('Fetching tiles for game ' + game.id);

            let tileId = 0;
            for(let tileData of game.board){
                socket.emit('setTile', JSON.stringify(tileData));
            };
            for(let unitData of game.units){
                socket.emit('setUnit', JSON.stringify(unitData));
            }

            socket.emit('finishBoard');
        }, true);
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
            let isBellongingToPlayer = SOURCE.getIsBelongingTo(GAME, socket.id);
            console.log('a user is attempting to perform the action ' + data.action)
            if(isTagetInRange && isValidAction && isBellongingToPlayer){
                action.useAction(TARGET, SOURCE, GAME);
            }else{
                console.log('that action was impossible');
                console.log('in range: ' + isTagetInRange);
                console.log('is valid: ' + isValidAction);
                console.log('is belonging to player: ' + isBellongingToPlayer);
            }
        }, true);
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