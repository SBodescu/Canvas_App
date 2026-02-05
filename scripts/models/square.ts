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
   getCollisionBox(): { x: number; y: number; h: number; w: number; } {
     return {
        x: this.point.x,
        y: this.point.y,
        h: this.sideLength,
        w: this.sideLength
     }
   }
   isInside(point: Point): boolean {
     const box = this.getCollisionBox();
     return (
        point.x >= box.x && point.x <= box.x + box.w &&
        point.y >= box.y && point.y <= box.y + box.h
    )
   }

}