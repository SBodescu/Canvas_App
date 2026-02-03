import Point from "./point.js";
import Shape from "./shape.js";

export default class Square extends Shape {
   sideLength: number;

   constructor(sideLength: number, color: string, point: Point) {
    super(point, color)
    this.sideLength = sideLength;
   }

   area(): number {
     return this.sideLength * this.sideLength;
   }

   draw(ctx: CanvasRenderingContext2D): void {
     ctx.fillRect(this.point.x, this.point.y, this.sideLength, this.sideLength);
     ctx.strokeRect(this.point.x, this.point.y, this.sideLength, this.sideLength);
     ctx.fillStyle = this.color;
   }

}