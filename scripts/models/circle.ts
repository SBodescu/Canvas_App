import  Shape from "./shape.js";
import Point from "./point.js";
export default class Circle extends Shape{
    radius: number;
    constructor(radius: number, color: string, point: Point,){
        super(point, color);
        this.radius = radius;
    }
    

    area(): number{
        return Math.PI * this.radius * this.radius;
    }

    draw(ctx: CanvasRenderingContext2D): void{
        ctx.beginPath();
        ctx.arc(this.point.x, this.point.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }
}