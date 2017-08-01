/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { getJSON } from './getJSON';
import { Point } from './Point'
export class Unit extends Point{
    card;
    actionsLeft:number;
    highlightedAction:string = 'movement';
    img:string;
    private _highlightedTiles:Point[] = [];
    private _isSelected:boolean = false;
    constructor(x:number, y:number, unitData, private changeBoard){
        super(x, y);
        let card = unitData.card;
        this.img = card.folderPath + card.unitImg;
        this.card = card;
        this.actionsLeft = card.action.perTurn;
    }
    private mapToPointList(map):Point[]{
        let pointList:Point[] = [];
        let self = this;
        map.map((layerPoints, _depth) => {
            let depth = _depth+1;
            let topRight = 0; 
            let bottomRight = depth*2;
            let bottomLeft = depth*4;
            let topLeft = depth*6; 
            layerPoints.map((possiblePoint, _i) => {
                if(possiblePoint){
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
                    }else if(i < topLeft+depth-1){
                        i -= topLeft;
                        point = new Point(i-depth, -depth);
                    }else{
                        console.error('A layer map has a point out of range')
                        return false;
                    }
                    point = point.combine(self);
                    pointList.push(point);
                }
            });
        });
        return pointList;
    }
    get highlightedTiles():Point[]{
        return this._highlightedTiles;
    }
    set highlightedTiles(tilesToHighlight:Point[]){
        this._highlightedTiles = tilesToHighlight;
        this.changeBoard((board) => {
            for(let tile of board){
                board[tile.id].isHighlighted = false;
                for(let point of tilesToHighlight){
                    if(tile.isAt(point)){
                        board[tile.id].isHighlighted = true;
                    }
                }
            }
            return board;
        });
        this._highlightedTiles = tilesToHighlight;
    }
    get isSelected():boolean{
        return this._isSelected;
    }
    set isSelected(val:boolean){
        this._isSelected = true;
        if(val){
            this.highlightedTiles = this.mapToPointList(this.card.action[this.highlightedAction].map);
            console.log(this.highlightedTiles);
        }else{
            this.highlightedTiles = [];
        }
    }
}