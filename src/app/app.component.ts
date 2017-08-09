/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { Component, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { GameListing } from '../utils/GameListing';
import { GameBoardComponent } from './game-board/game-board.component'
import { SideBoardComponent } from './side-board/side-board.component'
import * as socketIo from 'socket.io-client';
import { getJSON } from '../utils/getJSON';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.pug',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    @ViewChild(GameBoardComponent) gameBoard:GameBoardComponent;
    @ViewChild(SideBoardComponent) sideBoard:SideBoardComponent
    isInAGame:boolean=false;
    currentGameId:number;
    gameListings:GameListing[]=[];
    boards:boolean[]=[true, false, false];
    windowWidth:number;
    windowHeight:number;
    minWindowSize:number;
    maxWindowSize:number;
    scale:number;
    isWindowVertical:boolean;
    gameToJoin;
    unitActions = {};
    unitTypes;
    layout;
    socket;
    constructor(@Inject(DOCUMENT) private document: any) { 
        console.log('loading on ' + this.document.location.origin);
        this.socket = socketIo.connect(this.document.location.origin); 
        let self = this;
        getJSON('layout.json', function(data){
            self.layout = data;
        });
        getJSON('actions/actions.json', function(data){
            for(let actionName of data.actions){
                let action = require('../assets/actions/'+actionName+'.js')
                self.unitActions[actionName] = action;
            }
        });
    }
    setSelectedCard(card){
        let self = this;
        return function(card){
            self.sideBoard.selectedCard = card;
        }
    }
    ngOnInit(){
        this.initSocketHandlers();
        this.gameToJoin = window.document.getElementById('body').attributes.getNamedItem('game').value;
        if(this.gameToJoin){
            console.info('attempting to join the private game ' + this.gameToJoin);
            this.socket.emit('joinGame', this.gameToJoin);
        }else{
            this.socket.emit('getGameListings');
        }
    }
    initSocketHandlers(){
        this.socket.on('makeGameListing', res => this.onMakeGameListing(res));
        this.socket.on('updateGameListing', res => this.onUpdateGameListing(res));
        this.socket.on('removeGameListing', res => this.onRemoveGameListing(res));
        this.socket.on('joinGame', res => this.onJoinGame(Number(res)));
        this.socket.on('alertUser', res => alert(res));
        this.socket.on('confirmPrivateGame', res => this.onConfirmPrivateGame(res));
        this.socket.on('reload', res => this.onReloadRequest(res));
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
        this.scale = this.minWindowSize/100;
        if(this.minWindowSize == this.windowHeight){
            this.isWindowVertical=true;
        }else{
            this.isWindowVertical=false;
        }
        if(this.isInAGame){
            this.gameBoard.refreshTileSizes();
        }
    }
    onEndTurn(event){
        this.socket.emit('endTurn');
    }
    onRequestPrivateGame(event){
        this.socket.emit('requestPrivateGame', this.socket.id);
        console.log('attemping to create private game:' +  this.socket.id);
    }
    onConfirmPrivateGame(res){
        window.location.href += 'game/' + res;
    }
    onMakeGameListing(res){
        res = JSON.parse(res);
        this.gameListings[res.id] = new GameListing(res.name, res.id, res.time);
        if(res.players){
            this.gameListings[res.id].currentPlayers = res.players;
        }
    }
    onUpdateGameListing(res){
        this.gameListings[res.id] = JSON.parse(res);
    }
    onReloadRequest(res){
        console.info(res);
        window.location.href = window.location.origin;
        window.location.reload();
    }
    onRemoveGameListing(res){
        res = JSON.parse(res);
        this.gameListings[res.id] = undefined;
    }
    onJoinButton(gameId){
        this.socket.emit('joinGame', gameId);
    }
    onJoinGame(gameId){
        if(!this.isInAGame){
            this.currentGameId = gameId;
            this.isInAGame = true;
        }
    }
}
