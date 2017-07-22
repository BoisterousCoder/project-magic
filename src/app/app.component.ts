/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { Component, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { GameListing } from '../utils/GameListing';
import { GameBoardComponent } from './game-board/game-board.component'
import * as socketIo from 'socket.io-client';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    @ViewChild('gameBoard') gameBoard:GameBoardComponent;
    isInAGame:boolean=false;
    currentGameId:number;
    gameListings:GameListing[]=[];
    windowWidth:number;
    windowHeight:number;
    minWindowSize:number;
    maxWindowSize:number;
    isWindowVertical:boolean;
    socket;
    constructor(@Inject(DOCUMENT) private document: any) { 
        console.log('loading on ' + this.document.location.href);
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
        this.socket.on('joinGame', function(res){
            if(!self.isInAGame){
                self.onJoinGame(Number(res));
            }
        });
        this.socket.on('alertUser', function(res){
            alert(res);
        });
    }
    onResize(event){
        let window;
        if(event.target.defaultView){
            window = event.target.defaultView
        }else{
            window = event.target;
        }
        // window.scrollTo(0, 20); TODO: Fix this
        this.windowWidth = window.innerWidth; 
        this.windowHeight = window.innerHeight;
        this.minWindowSize = Math.min(this.windowWidth, this.windowHeight);
        this.maxWindowSize = Math.max(this.windowWidth, this.windowHeight);
        if(this.minWindowSize == this.windowHeight){
            this.isWindowVertical=true;
        }else{
            this.isWindowVertical=false;
        }
        if(this.isInAGame){
            this.gameBoard.refreshTileSizes();
        }
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
    onJoinButton(gameId){
        this.socket.emit('joinGame', gameId);
    }
    onJoinGame(gameId){
        this.currentGameId = gameId;
        this.isInAGame = true;
    }
}
