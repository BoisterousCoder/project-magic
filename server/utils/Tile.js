const Point = require('./Point');

class Tile extends Point{
    constructor(tileData){
        super(tileData.x, tileData.y);
        this.__isPassable = true;
        this.entrances = tileData.entrances;
        this.color = tileData.color;
        this.id = tileData.id
        this.isWater = tileData.isWater;
    }
    get isPassable(){
        let isUnitBlocking = (this.unitId || this.unitId == 0);
        return (!isUnitBlocking && !this.isWater) && this.__isPassable;
    }
    set isPassable(isPassable){
        this.__isPassable = isPassable;
    }
}

module.exports = Tile;