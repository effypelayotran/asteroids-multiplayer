export class Sprite {
    constructor(position, heading, points, color = 'white') {
        this.position = position;
        this.heading = heading;
        this.points = points;
        this.angle = 0;
        this.color = color;
    }

    move(width, height) {
        this.position.add(this.heading);

        // Wrap around screen
        if (this.position.x < 0) this.position.x += width;
        if (this.position.x > width) this.position.x -= width;
        if (this.position.y < 0) this.position.y += height;
        if (this.position.y > height) this.position.y -= height;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        this.points.forEach(([x, y], i) => {
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}
