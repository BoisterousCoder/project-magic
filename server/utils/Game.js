/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const GEN_GAME_BOARD = require('./genGameBoard.js');
const Unit = require('./Unit.js');

class Game{
    constructor(id, io){
        this.id=id;
        this.io=io;
        this.players=[];
        this.board=[];
        this.units=[];
        this.maxPlayers=2;
        this.genBoard();
    }
    genBoard(){
        this.board = [];
        let testUnit1 = new Unit(12, 12, 0); //Testing Only
        testUnit1.id = 0                     //Testing Only
        this.units[0] = testUnit1;           //Testing Only
        let testUnit2 = new Unit(13, 12, 0); //Testing Only
        testUnit2.id = 1                     //Testing Only
        this.units[1] = testUnit2;           //Testing Only
        let self = this;
        GEN_GAME_BOARD(function(tiles){
            self.board = tiles;
        });
    }
    disconect(socketId){
        let self = this;
        this.players.map(function(player){
            if(player.socket.id == socketId){
                self.emit('reload', 'other player disconected');
                self.players = [];
                self.io.emit('updateGameListing', JSON.stringify(self.listing));
            }
        });
        this.genBoard();
    }
    setTile(tileId, property, value){
        if(value || value == 0 || value == ''){
            console.log('setting a tile\'s'  + property + ' to ' + value);
            this.board[tileId][property] = value;
        }else if(property.id){
            console.log('setting an entire tile\'s value');
            this.board[unitId] = property;
        }else{
            for(let property in value){
                if (value.hasOwnProperty(property)) {
                    console.log('setting ' + key + ' of tile ' + tileId +' to ' + property[key]);
                    this.board[tileId][property] = value[property];
                }
            }
        }
        this.emit('setTile', JSON.stringify(this.board[tileId]));
    }
    setUnit(unitId, property, value){
        let unit;
        if(property != undefined){
            if(value || value == 0 || value == ''){
                console.log('setting a unit\'s ' + property + ' to ' + value);
                this.units[unitId][property] = value;
            }else if(property.id){
                console.log('setting an entire unit\'s value');
                this.units[unitId] = property;
            }else{
                for(let key in property){
                    if (property.hasOwnProperty(key)) {
                        console.log('setting ' + key + ' of unit ' + unitId +' to ' + property[key]);
                        this.units[unitId][key] = property[key];
                    }
                }
            }
            unit = this.units[unitId];
            for(let tile of this.board){
                if(unit.isAt(tile)){
                    tile.unitId = unit.id;
                }else if(tile.unitId == unit.id){
                    tile.unitId = undefined;
                }
            }
        }else{
            for(let tile of this.board){
                if(tile.unitId == unit.id){
                    tile.unitId = undefined;
                }
            }
            this.units[unitId] = {isDead:true, id:unitId};
            unit = this.units[unitId];
        }
        this.emit('setUnit', JSON.stringify(unit));
    }
    isPlayerInGame(socketId){
        let isPlayerInGame = false;
        this.players.map(function(player){
            if(player.socket.id == socketId){
                isPlayerInGame = true;
            }
        });
        return isPlayerInGame;
    }
    emit(title, msg){
        this.players.map(function(player){
            player.socket.emit(title, msg);
        });
    }
    get listing(){
        return {name:'Game '+(this.id+1), id:this.id, players:this.players.length, maxPlayers:this.maxPlayers};
    }
}

module.exports = Game;