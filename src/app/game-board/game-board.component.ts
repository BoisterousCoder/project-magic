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
    templateUrl: './game-board.component.pug',
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
        console.log('Joining Game with id '+this.gameId);
        this.socket.emit('getGameData');
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
    get changeBoard(){
        let self = this;
        return function changeBoard(callback){
            let board = callback(self.board, self.units);
            if(board){
                self.board = board;
            }
        }
    }
    initSocketHandlers(){
        this.socket.on('setTile', res => this.onTileSet(res));
        this.socket.on('setUnit', res => this.onUnitSet(res));
        this.socket.on('setOwner', res => this.onSetOwner(res));
        this.socket.on('finishBoard', res => this.socket.emit('getBase'));
    }
    refreshTileSizes(){
        this.printScale = (this.minWindowSize * (this.layout.viewBox.width/100))/this.boardSize;
        this.landSize = this.printScale * (this.boardSize/this.boardZoom);
    }
    onTileSet(res:string){
        let tileData = JSON.parse(res);
        this.board[tileData.id] = new Tile(tileData.x, tileData.y, tileData);
    }
    onSetOwner(res){
        let unitId = Number(res);
        this.units[unitId].isBellongingToPlayer = true;
    }
    onUnitSet(res:string){
        let unitData = JSON.parse(res);
        if(!unitData.isDead){
            let isUnitSelected = false;
            let isBellongingToPlayer = false;
            if(this.units[unitData.id]){
                if(this.units[unitData.id].isSelected){
                    this.units[unitData.id].isSelected=false;
                    isUnitSelected = true;
                }
                if(this.units[unitData.id].isBellongingToPlayer){
                    isBellongingToPlayer = true;
                }
            }
            this.units[unitData.id] = new Unit(unitData.x, unitData.y, unitData, this.changeBoard, this.unitActions);
            for(let tile of this.board){
                if(tile.unitId || tile.unitId==0){
                    if(tile.unitId == unitData.id && !tile.isAt(unitData)){
                        tile.unitId = undefined;
                    }
                }else if(tile.isAt(unitData)){
                    tile.unitId = unitData.id;
                }
            }
            this.units[unitData.id].isBellongingToPlayer = isBellongingToPlayer;
            if(isUnitSelected){
                this.selectedUnit.isSelected = false;
                let unit = this.units[unitData.id];
                this.selectedUnit = unit;
                unit.isSelected = true;
            }
        }else{
            this.units[unitData.id] = unitData;
            for(let tile of this.board){
                if(tile.unitId || tile.unitId==0){
                    if(tile.unitId == unitData.id){
                        tile.unitId = undefined;
                    }
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
            if(unit.isBellongingToPlayer){
                if(unit == this.selectedUnit){
                    this.selectedUnit = undefined;
                    this.units[tile.unitId].isSelected = false;
                    this.setSelectedCard(undefined);
                }else{
                    this.selectedUnit = unit;
                    for(let unit of this.units){
                        unit.isSelected = false;
                    }
                    this.units[tile.unitId].isSelected = true;
                    this.setSelectedCard(unit.card);
                }
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
