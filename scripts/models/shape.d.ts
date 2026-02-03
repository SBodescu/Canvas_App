import Point from "./point.js";
export default abstract class Shape {
    point: Point;
    color: string;
    constructor(point: Point, color: string);
    abstract draw(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=shape.d.ts.map