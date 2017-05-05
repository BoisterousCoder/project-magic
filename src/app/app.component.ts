import { Component, Inject } from '@angular/core';
import * as socketIo from 'socket.io-client';
import {gameLoop, gameInit, FPS, STARTDELAY} from '../utils/game';
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
    boardZoom:number = 4;
    isWindowVertical:boolean;
    title = 'Project Magic';
	board:Tile[] = [];
    socket;
    constructor(@Inject(DOCUMENT) private document: any) { 
        this.socket = socketIo.connect(this.document.location.href); 
    }
    ngOnInit(){
        this.board = gameInit(this.board, this.socket);
        let timer = Observable.timer(STARTDELAY, 1000/FPS);
        timer.subscribe(t=>this.ticks = gameLoop(t, this.board));
    }
    onResize(event) {
        this.windowWidth = event.target.defaultView.innerWidth; 
        this.windowHeight = event.target.defaultView.innerHeight;
		console.log('window is ' + this.windowWidth + ' by ' + this.windowHeight);
        let smallSide = Math.min(this.windowWidth, this.windowHeight);
        this.printScale = smallSide/this.boardSize;
		console.log('print scale is ' + this.printScale);
        this.landSize = this.printScale * (this.boardSize/this.boardZoom);
		console.log('land size is' + this.landSize);
        if(smallSide == this.windowHeight){
            this.isWindowVertical=true;
        }else{
            this.isWindowVertical=false;
        }
    }
    onTileClick(event){
        let target = event.target || event.srcElement || event.currentTarget;
        let id = target.attributes.tileId;
        this.board[id].onClick(this.socket);
    }
}
