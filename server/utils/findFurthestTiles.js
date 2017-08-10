/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
module.exports = function(board){
    let furthestDistance = 0;
    let furthestSource;
    let furthestTarget;
    for(let source of board){
        if(source.isPassable){
            let target = getFurthestFromTile(board, source);
            let distance = Math.abs(target.distance(source).r);
            if(furthestDistance < distance){
                furthestDistance = distance;
                furthestTarget = target;
                furthestSource = source;
            }
        }
    }
    return [furthestSource,furthestTarget]
}
function getFurthestFromTile(board, source){
    let furthestDistance = 0;
    let furthestTile;
    for(let tile of board){
        if(tile.isPassable){
            let distance = Math.abs(source.distance(tile).r);
            if(furthestDistance < distance){
                furthestDistance = distance;
                furthestTile = tile;
            }
        }
    }
    return furthestTile;
}