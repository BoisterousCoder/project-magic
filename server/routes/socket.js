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
            console.log('setting tiles');
            let id = 0;
            for(let x = 0; x < 16; x++){
                for(let y = 0; y < 16; y++){
                    let tileData = {
                        x:x, 
                        y:y, 
                        id:id,
                        color:'green',
                        entrances:[
                            Math.round(Math.random()), 
                            Math.round(Math.random()), 
                            Math.round(Math.random()), 
                            Math.round(Math.random())
                        ]
                    };
                    if(tileData.entrances.stringify() !== [0,0,0,0].stringify()){
                        socket.emit('setTile', JSON.stringify(tileData));
                        id++;
                    }
                }
            }
            
        });


        //brodcast example
        // socket.on('joinRequest', function(res) {
        //     io.emit('joinRequest', res);
        // });
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
