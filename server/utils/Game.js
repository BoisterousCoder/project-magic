/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const GEN_GAME_BOARD = require('./genGameBoard.js');
const Unit = require('./Unit.js');
const findFurthestTiles = require('./findFurthestTiles');
const EMPTINESS_UPDATE_DELAY = 60 * 1000;//In miliseconds

class Game{
    constructor(id, io){
        this.id=id;
        this.name = 'Game ' + (id + 1)
        this.io=io;
        this.players=[];
        this.board=[];
        this.baseIds=[];
        this.units=[];
        this.owner={};
        this.password='';
        this._destroyFunc = false;
        this.maxPlayers=2;
        this.genBoard();
    }
    set destroyFunc(func){
        this._destroyFunc = func;
        setTimeout(this.destroyIfEmpty(), EMPTINESS_UPDATE_DELAY);
    }
    destroyIfEmpty(){
        let self = this;
        return function(){        
            if(self.players.length > 0){
                console.log('Private game ' + self.name + ' will not be destroyed for now, as there are still players inside');
                setTimeout(self.destroyIfEmpty(), EMPTINESS_UPDATE_DELAY);
            }else{
                self._destroyFunc(self.id);
            }
        }

    }
    genBoard(){
        this.board = [];
        let self = this;
        GEN_GAME_BOARD(function(tiles){
            self.board = tiles;
            let furthestTiles = findFurthestTiles(tiles);
            for(let tile of furthestTiles){
                let base = new Unit(tile.x, tile.y, 0);
                base.id = self.units.length;
                self.units[base.id] = base;
                self.baseIds.push(base.id);
            }
        });
    }
    disconect(socketId){
        let self = this;
        this.players.map(function(player){
            if(player.socket.id == socketId){
                self.emit('reload', 'other player disconected');
                self.players = [];
                self.board = [];
                self.units = [];
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
    setUnitOwner(unitId, socketId){
        if(!this.owner[socketId]){
            this.owner[socketId] = {}
        }
        this.owner[socketId][unitId] = true;

        let player = this.getPlayer(socketId);        
        console.log('setting unit '+unitId+' to be owned by ' + socketId)
        player.socket.emit('setOwner', unitId);
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
    getPlayer(socketId){
        for(let player of this.players){
            if(player.socket.id == socketId){
                return player;
                break;
            }
        }
    }
    get listing(){
        return {name:this.name, id:this.id, players:this.players.length, maxPlayers:this.maxPlayers};
    }
}

module.exports = Game;