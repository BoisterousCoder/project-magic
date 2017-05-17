import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { GameListing } from '../utils/GameListing';
import * as socketIo from 'socket.io-client';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    isInAGame:boolean=false;
    gameListings:GameListing[]=[];
    socket;
    constructor(@Inject(DOCUMENT) private document: any) { 
        console.log(this.document.location.href);
        this.socket = socketIo.connect(this.document.location.href); 
    }
    ngOnInit(){
        this.initSocketHandlers();
        this.socket.emit('getGameListings');
    }
    initSocketHandlers(){
        let self = this;
        this.socket.on('makeGameListing', function(res){
            if(!self.isInAGame){
                self.onMakeGameListing(res);
            }
            
        });
        this.socket.on('updateGameListing', function(res){
            if(!self.isInAGame){
                self.onUpdateGameListing(res);
            }
        });
        this.socket.on('removeGameListing', function(res){
            if(!self.isInAGame){
                self.onRemoveGameListing(res);
            }
        });
    }
    onMakeGameListing(res){
        res = JSON.parse(res);
        this.gameListings[res.id] = new GameListing(res.name, res.id, res.time);
        if(res.players){
            this.gameListings[res.id].currentPlayers = res.players;
        }
    }
    onUpdateGameListing(res){
        res = JSON.parse(res);
        this.gameListings[res.id][res.property] = res.value; 
    }
    onRemoveGameListing(res){
        res = JSON.parse(res);
        this.gameListings[res.id] = undefined;
    }
}
