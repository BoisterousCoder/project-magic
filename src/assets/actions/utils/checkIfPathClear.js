'use strict'
const Point = require('./Point');

module.exports = function(target, source, board){
    let distance = target.distance(source);
    let isPathClear = true;
    let f;
    if(Math.abs(distance.x) > 0){
        f = (x =>{return (distance.y/distance.x)*(x-source.x)+source.y});
    }else{
        f = (x =>{return target.y});
    }
    let max = Math.max(source.x, target.x);
    let min = Math.min(source.x, target.x)
    for(let tile of board){
        if(tile.x < max && tile.x > min){
            let ys = [Math.ceil(f(tile.x)), Math.floor(f(tile.x))];
            if(tile.y == ys[0] || tile.y == ys[1]){
                if(!tile.isPassable && !tile.isAt(source)){
                    isPathClear = false;
                }
            }
        }
    }
    return isPathClear;
}