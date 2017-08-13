/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const CARD_TYPES = require('./getCardTypes.js')();
const fs = require('fs');
let Point = require('./Point.js')

let assetsFolder = 'src/assets/'
let universalActions = {};
try{
    universalActions = JSON.parse(fs.readFileSync(assetsFolder+'actions/actions.json', 'utf8')).universalActions;
}catch(err){
    assetsFolder = 'public/assets/'
    universalActions = JSON.parse(fs.readFileSync(assetsFolder+'actions/actions.json', 'utf8')).universalActions;
}

class Unit extends Point{
    constructor(x, y, cardTypeId){
        super(x, y);
        this.card = CARD_TYPES[cardTypeId];
        this.isDead = false;
        for(let property in this.card.unit){
            if(this.card.unit.hasOwnProperty(property)){
                this[property] = this.card.unit[property];
            }
        }
        for(let actionName in universalActions){
            this.card.action[actionName] = universalActions[actionName];
        }
        this.actionsLeft = this.card.action.perTurn;
    }
    getIsBelongingTo(game, socketId){
        if(game.owner[socketId][this.id]){
            return true
        }else{
            return false
        }
    }
    mapToPointList(map){
        let pointList = [];
        let self = this;
        map.map((layerPoints, depth) => {
            let topRight = 0; 
            let bottomRight = depth*2;
            let bottomLeft = depth*4;
            let topLeft = depth*6; 
            layerPoints.map((possiblePoint, _i) => {
                if(possiblePoint && depth != 0){
                    let i = _i - depth;
                    let point;
                    if(i <= topRight){
                        point = new Point(i+depth, -depth);
                    }else if(i <= bottomRight){
                        i -= topRight;
                        point = new Point(depth, i-depth);
                    }else if(i <= bottomLeft){
                        i -= bottomRight;
                        point = new Point(depth-i, depth);
                    }else if(i <= topLeft){
                        i -= bottomLeft;
                        point = new Point(-depth, depth-i);
                    }else if(i <= topLeft+depth-1){
                        i -= topLeft;
                        point = new Point(i-depth, -depth);
                    }else{
                        console.error('A layer map has a point out of range')
                        return false;
                    }
                    point = point.combine(self);
                    pointList.push(point);
                }else if(possiblePoint){
                    let point = new Point(self.x, self.y);
                    pointList.push(point);
                }
            });
        });
        return pointList;
    }
    checkIfInRange(target, actionName){
        let pointList = this.mapToPointList(this.card.action[actionName].map);
        let isInRange = false;
        for(let tile of pointList){
            if(tile.isAt(target)){
                isInRange = true;
                break;
            }
        }
        return isInRange;
    }
}
module.exports = Unit;