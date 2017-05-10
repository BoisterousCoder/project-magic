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
            genGameBoard(function(tiles){
                tiles.map(function(tileData){
                    socket.emit('setTile', JSON.stringify(tileData));
                });
            });
        });
    });
};

function genGameBoard(callback){
    let nodes = genNodes(function(nodes){
        let tiles = [];
        nodes.map(function(node, i){
            tiles.push({
                x:node.x,
                y:node.y,
                entrances:node.sides,
                color:node.color
            });
        });
        callback(tiles);
    });
}
function genNodes(callback){
    nodes = [];
    nodes.push({x:8, y:8, sides:[1,1,1,1]});
    let isEmptySides = false;
    while(!isEmptySides){
        isEmptySides = true;
        nodes.map(function(node, i){
            if(node.sides[1] && !checkForNode(node.x, node.y-1, nodes)){
                nodes.push(genNode(node.x, node.y-1));
                isEmptySides = false;
            }
            if(node.sides[2] && !checkForNode(node.x+1, node.y, nodes)){
                nodes.push(genNode(node.x+1, node.y));
                isEmptySides = false;
            }
            if(node.sides[3] && !checkForNode(node.x, node.y+1, nodes)){
                nodes.push(genNode(node.x, node.y+1));
                isEmptySides = false;
            }
            if(node.sides[4] && !checkForNode(node.x-1, node.y, nodes)){
                nodes.push(genNode(node.x-1, node.y));
                isEmptySides = false;
            }
        });
        console.log('currennt number of nodes: ' + nodes.length);
    }
    callback(nodes);
}
function genNode(x, y){
    console.log('making node at '+x +':'+y)
    let thisNode = {x:x, y:y, sides:[]};
    for(let node of nodes){
        if(node.x==(x-1)&&node.y==(y)){
            thisNode.sides[4] = 1;
        }
        if(node.x==(x+1)&&node.y==(y)){
            thisNode.sides[2] = 1;
        }
        if(node.x==(x)&&node.y==(y-1)){
            thisNode.sides[1] = 1;
        }
        if(node.x==(x)&&node.y==(y+1)){
            thisNode.sides[3] = 1;
        }
    }
    thisNode.sides.map(function(isSideAnEntrance, i){
        if(!isSideAnEntrance){
            let rand=Math.ceil(Math.random()*100);
            if(rand < 33){
                thisNode.sides[i] = 1;
            }
        } 
    });
    return thisNode;
}
function checkForNode(x, y, nodes){
    let returnValue = false;
    for(let node of nodes){
        if(node.x==x&&node.y==y){
            returnValue = node;
        }
    }
    return returnValue;
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
