import { Tile } from './Tile';

export const FPS = 30;
export const STARTDELAY = 2000;

export function gameInit(board:Tile[], socket){
    let boardSize = 4;
    for(let x = 0; x < boardSize; x++){
        for(let y = 0; y < boardSize; y++){
            let tile = new Tile(x, y);
            tile.id = board.length;
            board.push(tile);
        }
    }

    socket.on('setTile', function(res:string) {
        board = tileify(res);
    });
    
    socket.emit('getTiles', socket.id);
    return board;
}

function tileify(res:string){
    let board:Tile[]=[];
    let tileData = JSON.parse(res);
    let tile = new Tile(tileData.x, tileData.y);
    tile.id = tileData.id;
    board[tile.id] = tile;
    return board;
}

export function gameLoop(iteration:number, board:Tile[]){
    return iteration;
}

export function onTileClick(board: Tile){
    
}