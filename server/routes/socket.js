const GEN_GAME_BOARD = require('../game/genGameBoard.js');
module.exports = function(io) {
    var gameListings = [{name:'test', id:0, players:0, time:new Date().getTime()}];
    var games = [{id:0, players:[], board:[]}]
    var peopleConected = new Wrapper(0, function() {
        console.log('There are now ' + peopleConected.get() + ' people conected.');
    });

    io.on('connection', function(socket) {
        //connect to client
        peopleConected.set(peopleConected.get() + 1);

        socket.on('disconnect', function() {
            peopleConected.set(peopleConected.get() - 1);
        });
        socket.on('getGameListings', function() {
            gameListings.forEach(function(gameListing){
                data = JSON.stringify(gameListing);
                socket.emit('makeGameListing', data);
            })
        });
        socket.on('clickedTile', function(res) {
            console.log('You clicked tile ' + res);
        });
        socket.on('getTiles', function(res){
            //TODO check if user is assined to game
            let game = games[Number(res)];
            console.log('Genning tiles for game ' + game.id);
            let tileId = 0;
            if(game.board.length < 5){
                GEN_GAME_BOARD(function(tileData){
                    if(tileData.entrances.toString() !== [0,0,0,0].toString()){
                        tileData.id = tileId;
                        socket.emit('setTile', JSON.stringify(tileData));
                        tileId++;
                    }
                });
            }else{
                game.board.forEach(function(tileData){
                     socket.emit('setTile', JSON.stringify(tileData));
                 });
            }
        });
        socket.on('joinGame', function(gameId){
            console.log('sending to player to game ' + gameId);
            let game = games[gameId];
            game.players.push({
                socket:socket,
                id:game.players.length
            });
            gameListings[gameId].players = game.players.length;
            socket.emit('joinGame', gameId);
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