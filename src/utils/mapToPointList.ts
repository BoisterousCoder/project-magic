import { Point } from './Point';

export function mapToPointList(map, loc:Point):Point[]{
    let pointList:Point[] = [];
    let self = this;
    map.map((layerPoints, depth) => {
        let topRight = 0; 
        let bottomRight = depth*2;
        let bottomLeft = depth*4;
        let topLeft = depth*6; 
        layerPoints.map((possiblePoint, _i) => {
            if(possiblePoint && depth != 0){
                let i = _i - depth;
                let point:Point;
                if(i <= topRight){
                    point = new Point(i+depth, -depth);
                }else if(i <= bottomRight){
                    i -= topRight;
                    point = new Point(depth, i-depth);
                }else if(i <= bottomLeft){
                    i -= bottomRight;
                    point = new Point(depth-i, depth);
                }else if(i <= topLeft){
                    i -= bottomLeft;
                    point = new Point(-depth, depth-i);
                }else if(i <= topLeft+depth-1){
                    i -= topLeft;
                    point = new Point(i-depth, -depth);
                }else{
                    console.error('A layer map has a point out of range')
                    return false;
                }
                point = point.combine(self);
                pointList.push(point);
            }else if(possiblePoint){
                let point = new Point(self.x, self.y);
                pointList.push(point);
            }
        });
    });
    return pointList;
}