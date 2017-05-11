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
            let tileId = 0;
            genGameBoard(function(tileData){
                if(tileData.entrances.toString() !== [0,0,0,0].toString()){
                    console.log('sending data...');
                    tileData.id = tileId;
                    socket.emit('setTile', JSON.stringify(tileData));
                    tileId++;
                }
            });
        });
    });
};

function genGameBoard(callback){
    genNode(8, 8, [], function(node){
        tile = {
            x:node.x,
            y:node.y,
            entrances:node.sides,
            color:'green'
        };
        callback(tile);
    });
}
function genNode(x, y, otherNodes, callback){
    console.log('making node at '+x +':'+y)
    let thisNode = {x:x, y:y, sides:[]};
    for(let otherNode of otherNodes){
        if(otherNode.x==(x)&&otherNode.y==(y-1)){
            thisNode.sides[0] = 1;
        }
        if(otherNode.x==(x+1)&&otherNode.y==(y)){
            thisNode.sides[1] = 1;
        }
        if(otherNode.x==(x)&&otherNode.y==(y+1)){
            thisNode.sides[2] = 1;
        }
        if(otherNode.x==(x-1)&&otherNode.y==(y)){
            thisNode.sides[3] = 1;
        }
    }
    for(let i = 0; i<4; i++){
        if(!thisNode.sides[i]){
            thisNode = setSideValue(thisNode, otherNodes, i, callback);
        }
    }
    otherNodes.push(thisNode);
    console.log(thisNode.sides);
    // thisNode.sides.map(function(isSideAnEntrance, i){
    //     if(isSideAnEntrance){
            
    //     } 
    // });
    callback(thisNode);
}
function setSideValue(node, otherNodes, sideNumber, callback){
    console.log('genning side value')
    if(node.x < 16 && node.x > 0 && node.y < 16 && node.y > 0){
        let rand=Math.ceil(Math.random()*100);
        if(rand < 33){
            node.sides[sideNumber] = 1;
            console.log('branching...')
            switch(sideNumber){
                case(0):
                    genNode(node.x, node.y-1, otherNodes, callback);
                    areAllEntrancesClosed=false;
                    break;
                case(1):
                    genNode(node.x+1, node.y, otherNodes, callback);
                    areAllEntrancesClosed=false;
                    break;
                case(2):
                    genNode(node.x, node.y+1, otherNodes, callback);
                    areAllEntrancesClosed=false;
                    break;
                case(3):
                    genNode(node.x-1, node.y, otherNodes, callback);
                    areAllEntrancesClosed=false;
                    break;
            }
        }else{
            node.sides[sideNumber] = 0;
        }
    }else{
        node.sides = [0,0,0,0];
    }
    return node;
}

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
