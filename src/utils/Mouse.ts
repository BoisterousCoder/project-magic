import {Point} from './Point';
export class Mouse{
    isDragging:boolean = false;
    loc:Point;
    locStart:Point;
    viewOffset:Point = new Point();
    moveCallback:any;
    get onMove(){
        let self = this;
        return function(event, scale=1){
            self.loc = new Point(event.clientX, event.clientY);
            self.loc = self.loc.scale(scale);
            let travelDistance;
            if(self.locStart){
                travelDistance = self.loc.distance(self.locStart);
            }else{
                travelDistance = 0;
            }
            self.moveCallback(travelDistance, self);
            self.locStart = self.loc;
        }
    }
    set onMove(moveCallback:any){
        this.moveCallback = moveCallback;
    }
    onDown(event){
        this.isDragging = true;
    }
    onUp(event){
        this.isDragging = false;
    }
}