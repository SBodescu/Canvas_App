import Point from "./point.js";
import Shape from "./shape.js";
export default class Triangle extends Shape {
    base: number;
    height: number;
    constructor(base: number, height: number, color: string, point: Point);
    area(): number;
    draw(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=triangle.d.ts.map