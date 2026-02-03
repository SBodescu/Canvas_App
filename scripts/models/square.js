import Shape from "./shape.js";
export default class Square extends Shape {
    constructor(sideLength, color, point) {
        super(point, color);
        this.sideLength = sideLength;
    }
    area() {
        return this.sideLength * this.sideLength;
    }
    draw(ctx) {
        ctx.fillRect(this.point.x, this.point.y, this.sideLength, this.sideLength);
        ctx.strokeRect(this.point.x, this.point.y, this.sideLength, this.sideLength);
        ctx.fillStyle = this.color;
    }
}
//# sourceMappingURL=square.js.map