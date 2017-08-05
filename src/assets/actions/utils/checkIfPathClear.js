'use strict'
const Point = require('./Point');

module.exports = function(target, source, board){
    let distance = target.distance(source);
    let isPathClear = true;
    let coordBoard = idToCoordBoard(board);
    let f;
    if(Math.abs(distance.x) > 0){
        f = (x =>{return (distance.y/distance.x)*(x-source.x)+source.y});
    }else{
        f = (x =>{return target.y});
    }
    for(let x in coordBoard){
        if(x < Math.max(source.x, target.x) && x > Math.min(source.x, target.x)){
            let ys = [Math.ceil(f(x)), Math.floor(f(x))];
            if(!coordBoard[x][ys[0]] || !coordBoard[x][ys[1]]){
                isPathClear = false;
            }
        }
    }
    return isPathClear;
}
function idToCoordBoard(idBoard){
    let coordBoard = []
    for(let tile of idBoard){
        if(coordBoard[tile.x]){
            coordBoard[tile.x][tile.y] = tile.isPassable;
        }else{
            coordBoard[tile.x] = [];
            coordBoard[tile.x][tile.y] = tile.isPassable;
        }
    }
    return coordBoard;
}