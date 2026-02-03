import Point from "./point.js";
import Shape from "./shape.js";

export default class Triangle extends Shape{
    base: number;
    height: number;

    constructor(base: number, height: number, color: string, point: Point) {
        super(point, color);
        this.base = base;
        this.height = height;
        
    }

    area(): number {
        return 0.5 * this.base * this.height;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.moveTo(this.point.x, this.point.y); 
        ctx.lineTo(this.point.x + (this.base / 2), this.point.y + this.height);
        ctx.lineTo(this.point.x - (this.base / 2),this.point.y + this.height);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

}
