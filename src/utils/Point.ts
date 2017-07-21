export class Point{
    x:number;
    y:number;
    constructor(x:number = 0, y:number = 0) {
        this.x = x;
        this.y = y;
    }
    distance(otherPoint:Point) {
        var distance = new Point(this.x - otherPoint.x, this.y - otherPoint.y);
        return distance;
    }
    combine(otherPoint:Point){
        var sum = new Point(this.x + otherPoint.x, this.y + otherPoint.y);
        return sum;
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
        var x = this.r * Math.cos(rad)
        var y = this.r * Math.sin(rad)
        this.x = x
        this.y = y
    }
    set deg(deg:number) {
        var rad = (Math.PI * deg) / 180
        this.rad = rad
    }
    set r(r) {
        var x = r * Math.cos(this.rad)
        var y = r * Math.sin(this.rad)
        this.x = x
        this.y = y
    }
}