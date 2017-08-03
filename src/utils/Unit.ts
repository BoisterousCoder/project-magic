/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { getJSON } from './getJSON';
import { Point } from './Point'

export class Unit extends Point{
    card;
    actionsLeft:number;
    img:string;
    id:number;
    private _highlightedAction:string = '';
    private _highlightedTiles:Point[] = [];
    private _isSelected:boolean = false;
    constructor(x:number, y:number, unitData, private changeBoard, private unitActions){
        super(x, y);
        for(let property in unitData){
            if(unitData.hasOwnProperty(property)){
                this[property] = unitData[property];
            }
        }
        this.img = this.card.folderPath + this.card.unitImg;
    }
    private mapToPointList(map):Point[]{
        let pointList:Point[] = [];
        let self = this;
        map.map((layerPoints, depth) => {
            let topRight = 0; 
            let bottomRight = depth*2;
            let bottomLeft = depth*4;
            let topLeft = depth*6; 
            layerPoints.map((possiblePoint, _i) => {
                if(possiblePoint && depth != 0){
                    let i = _i - depth;
                    let point:Point;
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
    private checkHighlight(_tile, _board, _units):boolean{
        let action = this.unitActions[this.highlightedAction];
        const self = this;
        const board = _board;
        const units = _units;
        const tile = _tile;
        return action.checkIfValidTarget(tile, self, board, units)
    }
    requestAction(socket, targetTileId){
        socket.emit("requestAction", JSON.stringify({
            action:this.highlightedAction,
            target:targetTileId,
            source:this.id
        }));
    }
    get highlightedTiles():Point[]{
        return this._highlightedTiles;
    }
    set highlightedTiles(tilesToHighlight:Point[]){
        this._highlightedTiles = tilesToHighlight;
        this.changeBoard((board, units) => {
            for(let tile of board){
                board[tile.id].highlight = null;
                for(let point of tilesToHighlight){
                    if(tile.isAt(point)){
                        let action = this.unitActions[this.highlightedAction];
                        let highlightTile:boolean = this.checkHighlight(tile, board, units)
                        if(highlightTile){
                            board[tile.id].highlight = action.color;
                        }
                    }
                }
            }
            return board;
        });
    }
    private get highlightedAction():string{
        return this._highlightedAction;
    }
    private set highlightedAction(highlightedAction:string){
        this._highlightedAction = highlightedAction;
        if(highlightedAction && this.isSelected){
            this.highlightedTiles = this.mapToPointList(this.card.action[this.highlightedAction].map);
        }else{
            this.highlightedTiles = [];
        }
    }
    get isSelected():boolean{
        return this._isSelected;
    }
    set isSelected(val:boolean){
        this._isSelected = val;
        if(val && this.highlightedAction){
            this.highlightedTiles = this.mapToPointList(this.card.action[this.highlightedAction].map);
        }else if(this.highlightedAction){
            this.highlightedAction = '';
        }
    }
}