import Point from "./point.js";
import Shape from "./shape.js";
export default class Square extends Shape {
    sideLength: number;
    constructor(sideLength: number, color: string, point: Point);
    area(): number;
    draw(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=square.d.ts.map