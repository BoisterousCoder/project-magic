/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { Component, OnInit, Input} from '@angular/core';
import { gameLoop, FPS, STARTDELAY, MAXZOOM, MINZOOM } from '../../utils/game';
import { Mouse } from '../../utils/Mouse';
import { Point } from '../../utils/Point';
import { Tile } from '../../utils/Tile';
import { Unit } from '../../utils/Unit';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'game-board',
    templateUrl: './game-board.component.html',
    styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
    printScale:number;
    boardSize:number = 100;
    landSize:number;
    ticks:number = 0;
    boardZoom:number = MAXZOOM;
    viewOffset:Point = new Point();
    mouse:Mouse = new Mouse();
    title:String = 'Project Magic';
    board:Tile[] = [];
    units:Unit[] = [];
    selectedUnit;
    @Input() socket;
    @Input() gameId;
    @Input() scale;
    @Input() layout;
    @Input() unitActions;
    @Input() setSelectedCard;
    @Input() minWindowSize;
    @Input() maxWindowSize;
    @Input() isWindowVertical;
    ngOnInit(){
        this.initSocketHandlers();
        console.log('Joining Game '+this.gameId);
        this.socket.emit('getGameData', this.gameId);
        let timer = Observable.timer(STARTDELAY, 1000/FPS);
        let self = this;
        this.mouse.onMove = function(distance, mouse){
            if(mouse.isDragging){
                self.viewOffset = distance.combine(self.viewOffset);
                self.boundVeiwOffset();
            }
        }
        this.refreshTileSizes();
    }
    boundVeiwOffset(){
        let max = 0;
        let min = this.boardZoom-MAXZOOM;
        if(this.viewOffset.x > max){
            this.viewOffset.x = max;
        }else if(this.viewOffset.x < min){
            this.viewOffset.x = min;
        }
        if(this.viewOffset.y > max){
            this.viewOffset.y = max;
        }else if(this.viewOffset.y < min){
            this.viewOffset.y = min;
        }
    }
    initSocketHandlers(){
        let self = this;
        this.socket.on('setTile', function(res){
            self.onTileSet(res);
        });
        this.socket.on('setUnit', function(res){
            self.onUnitSet(res);
        });
    }
    refreshTileSizes(){
        this.printScale = this.minWindowSize/this.boardSize;
        this.landSize = this.printScale * (this.boardSize/this.boardZoom);
    }
    onTileSet(res:string){
        let tileData = JSON.parse(res);
        this.board[tileData.id] = new Tile(tileData.x, tileData.y, tileData);
    }
    onUnitSet(res:string){
        let unitData = JSON.parse(res);
        let self = this;
        function changeBoard(callback){
            let board = callback(self.board, self.units);
            if(board){
                self.board = board;
            }
        }
        this.units[unitData.id] = new Unit(unitData.x, unitData.y, unitData, changeBoard, this.unitActions);
        for(let tile of this.board){
            let isInSameLoc = (tile.x==unitData.x && tile.y==unitData.y);
            if(tile.unitId || tile.unitId==0){
                if(tile.unitId == unitData.id && !isInSameLoc){
                    tile.unitId = undefined;
                }
            }else{
                if(isInSameLoc){
                    tile.unitId = unitData.id;
                }
            }
        }
    }
    onScroll(event){
        let target = event.target || event.srcElement || event.currentTarget;
        let scrollAmount = 20 - target.scrollTop;
        scrollTo(target, 20);
        this.boardZoom -= scrollAmount;
        if(this.boardZoom > MAXZOOM){
            this.boardZoom = MAXZOOM;
        }else if(this.boardZoom < MINZOOM){
            this.boardZoom = MINZOOM;
        }else{
            //TODO: fix scroll centering
            this.boundVeiwOffset();
        }
        this.refreshTileSizes();
        return false;
    }
    onTileClick(event){
        let target = event.target || event.srcElement || event.currentTarget;
        let id = target.attributes.tileId.value;
        id = Number(id);
        let tile = this.board[id];
        if(tile.highlight){
            this.selectedUnit.requestAction(this.socket, tile.id);
        }else if(tile.unitId || tile.unitId==0){
            let unit = this.units[tile.unitId];
            if(unit == this.selectedUnit){
                this.selectedUnit = undefined;
                this.units[tile.unitId].isSelected = false;
                this.setSelectedCard(undefined);
            }else{
                this.selectedUnit = unit;
                this.units[tile.unitId].isSelected = true;
                this.setSelectedCard(unit.card);
            }
        }
    }
}

function scrollTo(target, location){
    try{
        target.scrollTo(0, location);
    }catch(e){
        target.scrollTop = location;
        target.scrollLeft = 0;
    }
}
