const Point = require('./Point');

class Tile extends Point{
    constructor(tileData){
        super(tileData.x, tileData.y);
        this._isPassable = true;
        this.entrances = tileData.entrances;
        this.color = tileData.color;
        this.id = tileData.id
    }
    get isPassable(){
        let isUnitBlocking = (this.unitId || this.unitId == 0);
        return (!isUnitBlocking) && this._isPassable;
    }
    set isPassable(isPassible){
        this._isPassable = isPassible;
    }
}

module.exports = Tile;