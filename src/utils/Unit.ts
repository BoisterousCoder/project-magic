/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { getJSON } from './getJSON';
import { Point } from './Point'
import { mapToPointList } from './mapToPointList'

export class Unit extends Point{
    card;
    actionsLeft:number;
    img:string;
    id:number;
    isBellongingToPlayer:boolean = false;
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
    private mapToPointList(map){
        return mapToPointList(map, this);
    }
    private checkHighlight(_tile, _board, _units):boolean{
        let action = this.unitActions[this.highlightedAction];
        const self = this;
        const board = _board;
        const units = _units;
        const tile = _tile;
        let isValid = action.checkIfValidTarget(tile, self, board, units)
        return isValid;
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
            if(this.highlightedAction){
                if(this.card.action[this.highlightedAction].hasNoRange){
                    for(let tile of board){
                        let action = this.unitActions[this.highlightedAction];
                        let highlightTile:boolean = this.checkHighlight(tile, board, units)
                        if(highlightTile){
                            board[tile.id].highlight = action.color;
                        }else{
                            board[tile.id].highlight = null;
                        }
                    }
                }else{
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
                }
            }else{
                for(let tile of board){
                    board[tile.id].highlight = null;
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