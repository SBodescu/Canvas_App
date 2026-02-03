import Point from "./point.js";

export default abstract class Shape{
    public point: Point;
    public color: string;
    constructor(point: Point, color: string){
        this.point = point;
        this.color = color;
    }
    abstract area():number;
    abstract draw(ctx: CanvasRenderingContext2D):void;
}