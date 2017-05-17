const GEN_GAME_BOARD = require('../game/genGameBoard.js');
module.exports = function(io) {
    var peopleConected = new Wrapper(0, function() {
        console.log('There are now ' + peopleConected.get() + ' people conected.');
    });

    io.on('connection', function(socket) {
        //connect to client
        peopleConected.set(peopleConected.get() + 1);

        socket.on('disconnect', function() {
            //io.emit('disconnector', socket.id);
            peopleConected.set(peopleConected.get() - 1);
        });
        socket.on('clickedTile', function(res) {
            console.log('You clicked tile ' + res);
        });
        socket.on('getTiles', function(res){
            console.log('Genning tiles...');
            let tileId = 0;
            GEN_GAME_BOARD(function(tileData){
                if(tileData.entrances.toString() !== [0,0,0,0].toString()){
                    tileData.id = tileId;
                    socket.emit('setTile', JSON.stringify(tileData));
                    tileId++;
                }
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