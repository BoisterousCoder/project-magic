/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { Tile } from './Tile';

export const FPS = 30;
export const STARTDELAY = 2000;
export const MAXZOOM = 24;
export const MINZOOM = 3;

export function gameLoop(iteration:number, board:Tile[]){
    return iteration;
}