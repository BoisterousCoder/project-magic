'use strict'
const Point = require('./Point');

module.exports = function(target, source, board){
    let distance = target.distance(source);
    let isPathClear = true;
    if(Math.abs(distance.x) > Math.abs(distance.y)){
        let f = (x =>{return (distance.y/distance.x)*(x-source.x)+source.y});
        let domainMax = Math.max(source.x, target.x);
        let domainMin = Math.min(source.x, target.x)
        for(let tile of board){
            if(tile.x < domainMax && tile.x > domainMin){
                let ys = [Math.ceil(f(tile.x)), Math.floor(f(tile.x))];
                if(tile.y == ys[0] || tile.y == ys[1]){
                    if(!tile.isPassable && !tile.isAt(source)){
                        isPathClear = false;
                    }
                }
            }
        }
    }else{
        let f = (y =>{return (distance.x/distance.y)*(y-source.y)+source.x});
        let rangeMax = Math.max(source.y, target.y);
        let rangeMin = Math.min(source.y, target.y)
        for(let tile of board){
            if(tile.y < rangeMax && tile.y > rangeMin){
                let xs = [Math.ceil(f(tile.y)), Math.floor(f(tile.y))];
                if(tile.x == xs[0] || tile.x == xs[1]){
                    if(!tile.isPassable && !tile.isAt(source)){
                        isPathClear = false;
                    }
                }
            }
        }
    }
    return isPathClear;
}