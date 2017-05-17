import { Component, OnInit, Input} from '@angular/core';
import {gameLoop, FPS, STARTDELAY} from '../../utils/game';
import {Tile} from '../../utils/Tile'
import { Observable } from 'rxjs/Rx';

@Component({
	selector: 'game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
	windowWidth:number;
    windowHeight:number;
    printScale:number;
    boardSize:number = 100;
    landSize:number;
    ticks:number = 0;
    boardZoom:number = 16;
    isWindowVertical:boolean;
    title = 'Project Magic';
    board:Tile[] = [];
    @Input() socket;
    ngOnInit(){
        this.initSocketHandlers();
        this.socket.emit('getTiles', this.socket.id);
        let timer = Observable.timer(STARTDELAY, 1000/FPS);
    }
    initSocketHandlers(){
        let self = this;
        this.socket.on('setTile', function(res){
            self.onTileSet(res);
        });
    }
    onTileSet(res:string){
        console.log('setting tile '+res);
        let tileData = JSON.parse(res);
        this.board[tileData.id] = tileify(tileData);
    }
    onWheelUp(event){
        console.log(event);
    }
    onWheelDown(event){
        console.log(event);
    }
    onResize(event) {
        let window;
        if(event.target.defaultView){
            window = event.target.defaultView
        }else{
            window = event.target;
        }
        this.windowWidth = window.innerWidth; 
        this.windowHeight = window.innerHeight;
        let smallSide = Math.min(this.windowWidth, this.windowHeight);
        this.printScale = smallSide/this.boardSize;
        this.landSize = this.printScale * (this.boardSize/this.boardZoom);
        if(smallSide == this.windowHeight){
            this.isWindowVertical=true;
        }else{
            this.isWindowVertical=false;
        }
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
