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
    boardZoom:number = 1;
    isWindowVertical:boolean;
    title = 'Project Magic';
    socket;
    constructor(){
        this.socket = socketIo.connect("localhost"); 
    }
    onResize(event) {
        this.windowWidth = event.target.all[12].width.baseVal.value; 
        this.windowHeight = event.target.all[12].height.baseVal.value;
        let smallSide = Math.min(this.windowWidth, this.windowHeight);
        console.log(event.target);
        this.printScale = this.boardSize/smallSide;
        this.landSize = this.printScale * (this.boardSize/this.boardZoom);
    }
}
