import { Component, OnInit, Input} from '@angular/core';
import {gameLoop, FPS, STARTDELAY, MAXZOOM} from '../../utils/game';
import {Mouse} from '../../utils/Mouse';
import {Point} from '../../utils/Point';
import {Tile} from '../../utils/Tile';
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
    @Input() socket;
    @Input() gameId;
    @Input() windowWidth;
    @Input() windowHeight;
    @Input() minWindowSize;
    @Input() maxWindowSize;
    @Input() isWindowVertical;
    ngOnInit(){
        this.initSocketHandlers();
        console.log(this.gameId);
        this.socket.emit('getTiles', this.gameId);
        let timer = Observable.timer(STARTDELAY, 1000/FPS);
        this.mouse.boundsStart = new Point();
        this.mouse.boundsEnd = new Point(100, 100);
        let self = this;
        this.mouse.onMove = function(distance, mouse){
            if(mouse.isDragging && mouse.isInBounds){
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
    }
    refreshTileSizes(){
        this.printScale = this.minWindowSize/this.boardSize;
        this.landSize = this.printScale * (this.boardSize/this.boardZoom);
    }
    onTileSet(res:string){
        let tileData = JSON.parse(res);
        this.board[tileData.id] = tileify(tileData);
    }
    onScroll(event){
        let target = event.target || event.srcElement || event.currentTarget;
        let scrollAmount = 20 - target.scrollTop;
        scrollTo(target, 20);
        this.boardZoom -= scrollAmount;
        this.viewOffset.r += scrollAmount;
        this.boundVeiwOffset();
        if(this.boardZoom > MAXZOOM){
            this.boardZoom = MAXZOOM;
        }
        this.refreshTileSizes();
        return false;
    }
    onTileClick(event){
        let target = event.target || event.srcElement || event.currentTarget;
        let id = target.attributes.tileId.value;
        id = Number(id);
        this.board[id].onClick(this.socket);
    }
}

function tileify(tileData){
    let tile = new Tile(tileData.x, tileData.y);
    tile.id = tileData.id;
    tile.color = tileData.color;
    tile.unitIds = tileData.unitIds;
    tile.entrances = tileData.entrances;
    return tile;
}

function scrollTo(target, location){
    try{
        target.scrollTo(0, location);
    }catch(e){
        target.scrollTop = location;
        target.scrollLeft = 0;
    }
}
