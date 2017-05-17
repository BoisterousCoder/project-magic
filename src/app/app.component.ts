import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import * as socketIo from 'socket.io-client';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    isInAGame:boolean=true;
    socket;
    constructor(@Inject(DOCUMENT) private document: any) { 
        console.log(this.document.location.href);
        this.socket = socketIo.connect(this.document.location.href); 
    }
    
}