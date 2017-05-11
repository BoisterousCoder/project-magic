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
                    console.log('sending tiles to client...');
                    tileData.id = tileId;
                    socket.emit('setTile', JSON.stringify(tileData));
                    tileId++;
                }
            });
        });
    });
};

function genGameBoard(callback){
    let tiles = [];
    let nodes = [genNode(8, 8, [])];
    do{
        let output = iterateNodes(nodes);
        nodes = output[0];
        if(output[1]){
            break;
        }
    }while(true)
    console.log('finnished genning tiles');
    for(let node of nodes){
        tile = {
            x:node.x,
            y:node.y,
            entrances:node.sides,
            color:'green'
        };
        
        tiles.push(tile);
        callback(tile);
    }
}

function genNode(x, y, otherNodes){
    console.log('making node at '+x +':'+y)
    let thisNode = {x:x, y:y, sides:[1, 1, 1, 1], openEntrances:-1};
    for(let otherNode of otherNodes){
        if(otherNode.x==(x)&&otherNode.y==(y-1)){
            thisNode.sides[0] = 0;
        }
        if(otherNode.x==(x+1)&&otherNode.y==(y)){
            thisNode.sides[1] = 0;
        }
        if(otherNode.x==(x)&&otherNode.y==(y+1)){
            thisNode.sides[2] = 0;
        }
        if(otherNode.x==(x-1)&&otherNode.y==(y)){
            thisNode.sides[3] = 0;
        }
    }
    for(let i = 0; i<4; i++){
        if(!thisNode.sides[i]){
            thisNode = setSideValue(thisNode, otherNodes, i);
        }
    }
    console.log(thisNode.openEntrances);
    otherNodes.push(thisNode);
    console.log(thisNode.sides);
    return thisNode;
}

function iterateNodes(nodes){
    let isThereNewNode = false;
    nodes.map(function(node){
        node.sides.map(function(side, i){
            if(side){
                switch(i){
                    case(0):
                        nodes.push(genNode(node.x, node.y-1, nodes));
                        isThereNewNode=true;
                        break;
                    case(1):
                        nodes.push(genNode(node.x+1, node.y, nodes));
                        isThereNewNode=true;
                        break;
                    case(2):
                        nodes.push(genNode(node.x, node.y+1, nodes));
                        isThereNewNode=true;
                        break;
                    case(3):
                        nodes.push(genNode(node.x-1, node.y, nodes));
                        isThereNewNode=true;
                        break;
                }
            }
        });
    });
    return [nodes, isThereNewNode];
}

function setSideValue(thisNode, otherNodes, sideNumber){
    console.log('genning side value')
    if(thisNode.x < 16 && thisNode.x > 0 && thisNode.y < 16 && thisNode.y > 0 && 
        thisNode.sides[sideNumber] != 0 && !thisNode.sides[sideNumber])
    {
        let rand=Math.ceil(Math.random()*100);
        if(rand < 33){
            thisNode.sides[sideNumber] = 1;
        }else{
            thisNode.sides[sideNumber] = 0;
        }
    }else{
        console.log('a node is out of bounds');
        thisNode.sides = [0,0,0,0];
    }
    return thisNode;
}

function checkForNode(x, y, nodes){
    let isNodeAtLocation = false;
    for(let node of nodes){
        if(node.x == x && node.y == y){
            isNodeAtLocation = true;
            break;
        }
    }
    return isNodeAtLocation;
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
