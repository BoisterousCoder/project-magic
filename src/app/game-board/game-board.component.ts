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
    windowWidth:number;
    windowHeight:number;
    minWindowSize:number;
    printScale:number;
    boardSize:number = 100;
    landSize:number;
    ticks:number = 0;
    boardZoom:number = MAXZOOM;
    isWindowVertical:boolean;
    viewOffset:Point = new Point();
    mouse:Mouse = new Mouse();
    title:String = 'Project Magic';
    board:Tile[] = [];
    @Input() socket;
    @Input() gameId;
    ngOnInit(){
        this.initSocketHandlers();
        console.log(this.gameId);
        this.socket.emit('getTiles', this.gameId);
        let timer = Observable.timer(STARTDELAY, 1000/FPS);
        let self = this;
        this.mouse.onMove = function(distance, mouse){
            if(mouse.isDragging){
                self.viewOffset = distance.combine(self.viewOffset);
                let max = 0;
                let min = self.boardZoom-MAXZOOM;
                if(self.viewOffset.x > max){
                    self.viewOffset.x = max;
                }else if(self.viewOffset.x < min){
                    self.viewOffset.x = min;
                }
                if(self.viewOffset.y > max){
                    self.viewOffset.y = max;
                }else if(self.viewOffset.y < min){
                    self.viewOffset.y = min;
                }
            }
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
        // console.log('setting tile '+res);
        let tileData = JSON.parse(res);
        this.board[tileData.id] = tileify(tileData);
    }
    onScroll(event){
        let scrollAmount = 20 - event.pageY;
        event.view.scrollTo(0, 20);
        this.boardZoom -= scrollAmount;
        this.viewOffset.r += 0.5 * scrollAmount;
        if(this.boardZoom > MAXZOOM){
            this.boardZoom = MAXZOOM;
        }
        this.refreshTileSizes();
        return false;
    }
    onResize(event) {
        let window;
        if(event.target.defaultView){
            window = event.target.defaultView
        }else{
            window = event.target;
        }
        window.scrollTo(0, 20);
        this.windowWidth = window.innerWidth; 
        this.windowHeight = window.innerHeight;
        this.minWindowSize = Math.min(this.windowWidth, this.windowHeight);
        if(this.minWindowSize == this.windowHeight){
            this.isWindowVertical=true;
        }else{
            this.isWindowVertical=false;
        }
        this.refreshTileSizes();
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
