/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const GENCHANCE = 53;
const BOARDSIZE = 25;
const DEFAULTCOLOR = 'green';
const WATERCOLOR = 'none';
const Tile = require('./Tile');

module.exports = function(callback){
    let tiles = [];
    let midPoint = Math.round(BOARDSIZE/2);
    let nodes = [genNode(midPoint, midPoint, [], [1, 1, 1, 1])];
    while(true){
        let output = iterateNodes(nodes);
        nodes = output.nodes;
        if(!output.isThereNewNode){
            break;
        }
    }
    for(let id in nodes){
        let node = nodes[id]
        let isDuplicate = false;
        for(let tile of tiles){
            if(tile.isAt(node)){
                isDuplicate = true;
                break;
            }
        }
        if(!isDuplicate){
            let entrances = [];
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

            if(entrances.toString() !== [0,0,0,0].toString()){
                let tile = new Tile({
                    x:node.x,
                    y:node.y,
                    id:tiles.length,
                    entrances:entrances,
                    color:DEFAULTCOLOR,
                    isWater:false
                });

                tiles[tile.id] = tile;
            }
        }
    }
    console.log('Finnished gennerating tiles for a Game.');
    let missingTiles = findMissingTiles(tiles);
    for(let tile of missingTiles){
        tiles[tiles.length] = new Tile({
            x:tile.x,
            y:tile.y,
            id:tiles.length,
            entrances: [1, 1, 1, 1],
            color:WATERCOLOR,
            isWater:true
        });
    }
    callback(tiles);
}

function findMissingTiles(idBoard){
    let coordBoard = []
    let missingTiles = [];
    for(let tile of idBoard){
        if(coordBoard[tile.x]){
            coordBoard[tile.x][tile.y] = true;
        }else{
            coordBoard[tile.x] = [];
            coordBoard[tile.x][tile.y] = true;
        }
    }
    for(let x = 0; x < BOARDSIZE; x++){
        if(!coordBoard[x]){
            coordBoard[x] = [];
        }
        for(let y = 0; y < BOARDSIZE; y++){
            if(!coordBoard[x][y]){
                missingTiles.push({x:x, y:y})
            }
        }
    }
    return missingTiles;
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
    return {
        nodes:nodes,
        isThereNewNode:isThereNewNode
    }
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
