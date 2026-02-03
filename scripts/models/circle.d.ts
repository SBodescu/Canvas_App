import Shape from "./shape.js";
import Point from "./point.js";
export default class Circle extends Shape {
    radius: number;
    constructor(radius: number, color: string, point: Point);
    area(): number;
    draw(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=circle.d.ts.map