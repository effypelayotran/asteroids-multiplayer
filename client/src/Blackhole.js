import { Sprite } from './Sprite.js';
import { Vector2 } from './Vector2.js';

export class Blackhole extends Sprite {
    constructor(position, radius = 20) {
        const n = 16;
        const points = Array.from({ length: n + 1 }, (_, i) => {
            const angle = (i / n) * 2 * Math.PI;
            return [
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            ];
        });

        super(position, new Vector2(), points, 'blue');
        this.radius = radius;
    }

    applyGravity(ship) {
        const dx = this.position.x - ship.position.x;
        const dy = this.position.y - ship.position.y;
        const distSq = Math.max(dx * dx + dy * dy, this.radius ** 2);
        const force = 500 / Math.pow(distSq, 1.5);
        ship.heading.x += dx * force;
        ship.heading.y += dy * force;
    }
}
