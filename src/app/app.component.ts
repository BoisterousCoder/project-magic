import { Component, Inject } from '@angular/core';
import * as socketIo from 'socket.io-client';
import {gameLoop, FPS, STARTDELAY} from '../utils/game';
import {Tile} from '../utils/Tile'
import { Observable } from 'rxjs/Rx';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
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
    socket;
    constructor(@Inject(DOCUMENT) private document: any) { 
        console.log(this.document.location.href);
        this.socket = socketIo.connect(this.document.location.href); 
    }
    ngOnInit(){
        //this.board = gameInit(this.board, this.socket);
        this.initSocketHandlers();
        this.socket.emit('getTiles', this.socket.id);
        let timer = Observable.timer(STARTDELAY, 1000/FPS);
        //timer.subscribe(t=>this.ticks = gameLoop(t, function(res){
       // }));
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
    onResize(event) {
        // console.log(event);
        let window;
        if(event.target.defaultView){
            window = event.target.defaultView
        }else{
            window = event.target;
        }
        this.windowWidth = window.innerWidth; 
        this.windowHeight = window.innerHeight;
        // console.log('window is ' + this.windowWidth + ' by ' + this.windowHeight);
        let smallSide = Math.min(this.windowWidth, this.windowHeight);
        this.printScale = smallSide/this.boardSize;
        // console.log('print scale is ' + this.printScale);
        this.landSize = this.printScale * (this.boardSize/this.boardZoom);
        // console.log('land size is' + this.landSize);
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