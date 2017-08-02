/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const GEN_GAME_BOARD = require('./genGameBoard.js');
const Unit = require('./Unit.js');
// let assetsFolder = 'src/assets/'
// let actionNameList;
// try{
//     actionNameList = JSON.parse(fs.readFileSync(assetsFolder+'cards/cards.json', 'utf8'));
// }catch(err){
//     assetsFolder = 'public/assets/'
//     actionNameList = JSON.parse(fs.readFileSync(assetsFolder+'cards/cards.json', 'utf8'));
// }

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
        let tileId = 0;
        let testUnit1 = new Unit(12, 12, 0); //Testing Only
        testUnit1.id = 0                     //Testing Only
        this.units[0] = testUnit1;           //Testing Only
        let testUnit2 = new Unit(11, 12, 0); //Testing Only
        testUnit2.id = 1                     //Testing Only
        this.units[1] = testUnit2;           //Testing Only
        let self = this;
        GEN_GAME_BOARD(function(tileData){
            if(tileData.entrances.toString() !== [0,0,0,0].toString()){
                tileData.id = tileId;
                self.board[tileId] = tileData;
                tileId++;
            }
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
        if(value == undefined){
            value = property;
            this.board[tileId] = value;
        }else{
            this.board[tileId][property] = value;
        }
        this.emit('setTile', JSON.stringify(this.board[tileId]));
    }
    setUnit(unitId, property, value){
        if(value == undefined){
            value = property;
            this.units[unitId] = value;
        }else{
            this.units[unitId][property] = value;
        }
        this.emit('setUnit', JSON.stringify(this.units[unitId]));
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