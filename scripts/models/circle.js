import Shape from "./shape.js";
export default class Circle extends Shape {
    constructor(radius, color, point) {
        super(point, color);
        this.radius = radius;
    }
    area() {
        return Math.PI * this.radius * this.radius;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.point.x, this.point.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }
    getCollisionBox() {
        return {
            x: this.point.x - this.radius,
            y: this.point.y - this.radius,
            h: this.radius * 2,
            w: this.radius * 2
        };
    }
}
