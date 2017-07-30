/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
export class Point{
    x:number;
    y:number;
    constructor(x:number = 0, y:number = 0) {
        this.x = x;
        this.y = y;
    }
    distance(otherPoint:Point) {
        let distance = new Point(this.x - otherPoint.x, this.y - otherPoint.y);
        return distance;
    }
    combine(otherPoint:Point){
        let sum = new Point(this.x + otherPoint.x, this.y + otherPoint.y);
        return sum;
    }
    roundUp(scale=1){
        let roundedNum = new Point(Math.ceil(this.x/scale)*scale, Math.ceil(this.y/scale)*scale);
        return roundedNum;
    }
    roundDown(scale=1){
        let roundedNum = new Point(Math.floor(this.x/scale)*scale, Math.floor(this.y/scale)*scale);
        return roundedNum;
    }
    round(scale=1){
        let roundedNum = new Point(Math.round(this.x/scale)*scale, Math.round(this.y/scale)*scale);
        return roundedNum;
    }
    scale(scalar:number) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    isAtLocation(x:number, y:number){
        if(x==this.x&&y==this.y){
            return true;
        }else{
            return false;
        }
    }
    isInBounds(boundsStart:Point, boundsEnd:Point){
        if(
            this.x > boundsStart.x && this.y > boundsStart.y &&
            this.x < boundsEnd.x && this.y < boundsEnd.y
        ){
            return true;
        }else{
            return false
        }
    }
    get rad() {
        return Math.atan2(this.y, this.x)
    }
    get deg() {
        return (this.rad * 180) / Math.PI
    }
    get r() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }
    set rad(rad:number) {
        let x = this.r * Math.cos(rad)
        let y = this.r * Math.sin(rad)
        this.x = x
        this.y = y
    }
    set deg(deg:number) {
        let rad = (Math.PI * deg) / 180
        this.rad = rad
    }
    set r(r) {
        let x = r * Math.cos(this.rad)
        let y = r * Math.sin(this.rad)
        this.x = x
        this.y = y
    }
}