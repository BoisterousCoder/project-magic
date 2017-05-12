import { Tile } from './Tile';

export const FPS = 30;
export const STARTDELAY = 2000;

// export function gameInit(board:Tile[], socket){
//     socket.on('setTile', function(res:string) {
//         console.log('setting tile '+res);
//         let tileData = JSON.parse(res);
//         board[tileData.id] = tileify(tileData);
//     });
    
//     socket.emit('getTiles', socket.id);
//     return board;
// }

export function gameLoop(iteration:number, board:Tile[]){
    return iteration;
}