import { Component } from '@angular/core';
import * as socketIo from 'socket.io-client';
// import { pug_plugin_ng } from 'pug-plugin-ng';
// import { pug } from 'pug';

// let pug_opts = { doctype: 'html', plugins: [pug_plugin_ng] };

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
    boardZoom:number = 4;
    isWindowVertical:boolean;
    title = 'Project Magic';
	board = [
		{
			color:'blue',
			x:0,
			y:0
		}
	]
    socket;
    constructor(){
        this.socket = socketIo.connect("localhost"); 
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
    }
}
