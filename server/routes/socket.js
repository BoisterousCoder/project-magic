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
                        unitIds:[],
                        color:'green',
                        entrances:[
                            Math.round(Math.random()), 
                            Math.round(Math.random()), 
                            Math.round(Math.random()), 
                            Math.round(Math.random())
                        ]
                    };
                    if(tileData.entrances.toString() !== [0,0,0,0].toString()){
                        socket.emit('setTile', JSON.stringify(tileData));
                        id++;
                    }
                }
            }
            
        });
    });
};

function genGameBoard(){

}
function genNodes(){
    nodes = [];
    nodes.push({x:8, y:8, sides:[1,1,1,1]});
    let isEmptySides = false;
    while(!isEmptySides){
        isEmptySides = true;
        nodes.map(function(node, i){
            if(node.sides[1] && !checkForNode(x, y-1)){
                genNode(x, y-1);
                isEmptySides = false;
            }
            if(node.sides[2] && !checkForNode(x+1, y)){
                genNode(x+1, y);
                isEmptySides = false;
            }
            if(node.sides[3] && !checkForNode(x, y+1)){
                genNode(x, y+1);
                isEmptySides = false;
            }
            if(node.sides[4] && !checkForNode(x-1, y)){
                genNode(x-1, y);
                isEmptySides = false;
            }
        });
    }
}
function genNode(x, y){
    let thisNode = {x:x, y:y};
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
