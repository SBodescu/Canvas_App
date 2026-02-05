import Shape from "./shape.js";
export default class Triangle extends Shape {
    constructor(base, height, color, point) {
        super(point, color);
        this.base = base;
        this.height = height;
    }
    area() {
        return 0.5 * this.base * this.height;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.point.x, this.point.y);
        ctx.lineTo(this.point.x + (this.base / 2), this.point.y + this.height);
        ctx.lineTo(this.point.x - (this.base / 2), this.point.y + this.height);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
    getCollisionBox() {
        return {
            x: this.point.x - (this.base / 2),
            y: this.point.y,
            h: this.height,
            w: this.base
        };
    }
}
