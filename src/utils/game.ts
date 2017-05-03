import { Tile } from './Tile';

export const FPS = 30;
export const STARTDELAY = 2000;

export function gameInit(board:Tile[]){
    let boardSize = 4;
    for(let x = 0; x < boardSize; x++){
        for(let y = 0; y < boardSize; y++){
            let tile = new Tile(x, y);
            board.push(tile);
        }
    }
    return board;
}

export function gameLoop(iteration:number, board:Tile[]){
    return iteration;
}

export function onTileClick(board: Tile){
    
}