const GEN_GAME_BOARD = require('./genGameBoard.js');

class Game{
    constructor(id, io){
        this.id=id;
        this.io=io;
        this.players=[];
        this.board=[];
        this.maxPlayers=2;
        this.genBoard();
    }
    genBoard(){
        this.board = [];
        let tileId = 0;
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