import { Sprite } from './Sprite.js';
import { Vector2 } from './Vector2.js';

export class Ship extends Sprite {
    constructor(position, color) {
        const points = [
            [0, -10], [6, 10], [3, 7], [-3, 7], [-6, 10]
        ];
        super(position, new Vector2(), points, color);
        this.thrust = false;
        this.maxVelocity = 4;
        this.acceleration = 0.08;
        this.turnRate = 3;
    }

    rotateLeft() {
        this.angle += this.turnRate;
    }

    rotateRight() {
        this.angle -= this.turnRate;
    }

    increaseThrust() {
        const dx = this.acceleration * Math.sin(-this.angle * Math.PI / 180);
        const dy = this.acceleration * Math.cos(-this.angle * Math.PI / 180);
        this.heading.x += dx;
        this.heading.y += dy;

        const speed = Math.sqrt(this.heading.x ** 2 + this.heading.y ** 2);
        if (speed > this.maxVelocity) {
            const factor = this.maxVelocity / speed;
            this.heading.x *= factor;
            this.heading.y *= factor;
        }
    }

    draw(ctx) {
        super.draw(ctx);

        // Draw thrust flame
        if (this.thrust) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.angle * Math.PI / 180);
            ctx.beginPath();
            ctx.moveTo(-3, 7);
            ctx.lineTo(0, 13);
            ctx.lineTo(3, 7);
            ctx.closePath();
            ctx.strokeStyle = 'orange';
            ctx.stroke();
            ctx.restore();
        }
    }
}
