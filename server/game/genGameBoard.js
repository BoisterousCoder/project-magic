const GENCHANCE = 53;
const BOARDSIZE = 24;

module.exports = function(callback){
    let tiles = [];
    let nodes = [genNode(8, 8, [], [1, 1, 1, 1])];
    while(true){
        let output = iterateNodes(nodes);
        nodes = output[0];
        if(!output[1]){
            break;
        }
    }
    console.log('Finnished genning tiles.');
    console.log('Sending Tiles to user...');
    for(let node of nodes){
        let entrances = []
        node.sides.map(function(side, i){
            let isNodeThere;
            switch(i){
                case(0):
                    isNodeThere = checkForNode(node.x, node.y-1, nodes);
                    isNodeThere?entrances[i]=1:entrances[i]=0;
                    break;
                case(1):
                    isNodeThere = checkForNode(node.x+1, node.y, nodes);
                    isNodeThere?entrances[i]=1:entrances[i]=0;
                    break;
                case(2):
                    isNodeThere = checkForNode(node.x, node.y+1, nodes);
                    isNodeThere?entrances[i]=1:entrances[i]=0;
                    break;
                case(3):
                    isNodeThere = checkForNode(node.x-1, node.y, nodes);
                    isNodeThere?entrances[i]=1:entrances[i]=0;
                    break;
            }
        });
        tile = {
            x:node.x,
            y:node.y,
            entrances:entrances,
            color:'green'
        };
        
        tiles.push(tile);
        callback(tile);
    }
    console.log('Tiles sent to user.');
}

function genNode(x, y, otherNodes, sidesOverride){
    // console.log('making node at '+x +':'+y)
    let thisNode = {x:x, y:y, sides:[]};
    if(sidesOverride){
        thisNode.sides = sidesOverride;
    }
    if(checkForNode(x, y, otherNodes)){
        return false;
    }
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
    otherNodes.push(thisNode);
    // console.log(thisNode.sides);
    return thisNode;
}

function iterateNodes(nodes){
    let isThereNewNode = false;
    nodes.map(function(node){
        node.sides.map(function(side, i){
            let newNode;
            if(side){
                switch(i){
                    case(0):
                        newNode = genNode(node.x, node.y-1, nodes);
                        if(newNode){nodes.push(newNode);isThereNewNode=true;}
                        break;
                    case(1):
                        newNode = genNode(node.x+1, node.y, nodes);
                        if(newNode){nodes.push(newNode);isThereNewNode=true;}
                        break;
                    case(2):
                        newNode = genNode(node.x, node.y+1, nodes);
                        if(newNode){nodes.push(newNode);isThereNewNode=true;}
                        break;
                    case(3):
                        newNode = genNode(node.x-1, node.y, nodes);
                        if(newNode){nodes.push(newNode);isThereNewNode=true;}
                        break;
                }
            }
        });
    });
    return [nodes, isThereNewNode];
}

function setSideValue(thisNode, otherNodes, sideNumber){
    // console.log('genning side ' + sideNumber + ' value')
    if(thisNode[sideNumber] != 0 && !thisNode[sideNumber]){
        let rand=Math.ceil(Math.random()*100);
        if(rand < GENCHANCE){
            thisNode.sides[sideNumber] = 1;
        }else{
            thisNode.sides[sideNumber] = 0;
        }
    }else{
        // console.log('side is already set to ' + thisNode[sideNumber]);
    }
    return thisNode;
}

function checkForNode(x, y, nodes){
    let isNodeAtLocation = false;
    if(x < BOARDSIZE && x >= 0 && y < BOARDSIZE && y >= 0){
        for(let node of nodes){
            if(node.x == x && node.y == y){
                isNodeAtLocation = true;
                break;
            }
        }
    }else{
        // console.log('Attempted to access node out of range')
        isNodeAtLocation = true;
    }
    return isNodeAtLocation;
}
