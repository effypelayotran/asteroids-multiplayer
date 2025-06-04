// import { Ship } from './Ship.js';
// import { Blackhole } from './Blackhole.js';
// import { Vector2 } from './Vector2.js';

// export class Game {
//     constructor(ctx, width, height) {
//         this.ctx = ctx;
//         this.width = width;
//         this.height = height;
//         this.ships = [];
//         this.blackholes = [];
//         this.running = true;
//         this.paused = false;
//         this.frameAdvance = false;
//         this.showFPS = true;
//         this.lastTime = performance.now();
//         this.fps = 0;
//         this.frameCount = 0;
//         this.timePassed = 0;

//         this.setup();
//         this.bindInput();
//     }

//     setup() {
//         const center = new Vector2(this.width / 2, this.height / 2);
//         this.blackholes.push(new Blackhole(center));

//         const colors = ['#FF1414', '#14FF14', '#3232FF'];
//         for (let i = 0; i < 3; i++) {
//             const pos = new Vector2(
//                 Math.random() * this.width,
//                 Math.random() * this.height
//             );
//             this.ships.push(new Ship(pos, colors[i]));
//         }
//     }

//     bindInput() {
//         window.addEventListener('keydown', (e) => {
//             if (e.code === 'KeyP') this.paused = !this.paused;
//             if (e.code === 'KeyR') this.showFPS = !this.showFPS;
//             if (e.code === 'KeyO') this.frameAdvance = true;
//             if (e.code === 'Escape') window.close();
//         });
//     }

//     update(dt) {
//         if (this.paused && !this.frameAdvance) return;
//         this.frameAdvance = false;

//         for (let ship of this.ships) {
//             for (let bh of this.blackholes) {
//                 bh.applyGravity(ship);
//             }
//         }

//         for (let ship of this.ships) {
//             ship.move(this.width, this.height);
//         }
//     }

//     draw() {
//         this.ctx.clearRect(0, 0, this.width, this.height);

//         for (let bh of this.blackholes) bh.draw(this.ctx);
//         for (let ship of this.ships) ship.draw(this.ctx);

//         if (this.showFPS) {
//             this.ctx.font = '15px Hyperspace';
//             this.ctx.fillStyle = 'white';
//             this.ctx.fillText(`${this.fps} FPS`, this.width / 2 - 20, 20);
//         }
//     }

//     loop = (now) => {
//         const dt = (now - this.lastTime) / 1000;
//         this.lastTime = now;

//         this.frameCount++;
//         this.timePassed += dt;
//         if (this.frameCount >= 10) {
//             this.fps = Math.round(this.frameCount / this.timePassed);
//             this.frameCount = 0;
//             this.timePassed = 0;
//         }

//         this.update(dt);
//         this.draw();
//         requestAnimationFrame(this.loop);
//     };

//     start() {
//         requestAnimationFrame(this.loop);

//         // Bind ship controls
//         window.addEventListener('keydown', (e) => {
//             const keyMap = [
//                 ['ArrowLeft', 'ArrowRight', 'ArrowUp'],
//                 ['KeyZ', 'KeyX', 'KeyS'],
//                 ['KeyJ', 'KeyK', 'KeyI']
//             ];

//             for (let i = 0; i < this.ships.length; i++) {
//                 const ship = this.ships[i];
//                 ship.thrust = false;

//                 if (e.code === keyMap[i][0]) ship.rotateLeft();
//                 if (e.code === keyMap[i][1]) ship.rotateRight();
//                 if (e.code === keyMap[i][2]) {
//                     ship.increaseThrust();
//                     ship.thrust = true;
//                 }
//             }
//         });
//     }
// }
import { Ship } from './Ship.js';
import { Blackhole } from './Blackhole.js';
import { Vector2 } from './Vector2.js';

export class Game {
    constructor(ctx, width, height, socket) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.socket = socket;

        this.ships = {}; // shipId → Ship
        this.blackholes = [new Blackhole(new Vector2(width / 2, height / 2))];
        this.clientId = null;
        this.bindInput();
        this.lastTime = performance.now();

        socket.onmessage = (msg) => {
            const data = JSON.parse(msg.data);
            if (data.type === "init") {
                this.clientId = data.id;
            } else if (data.type === "state") {
                this.updateShipStates(data.ships);
            }
        };
    }

    bindInput() {
        window.addEventListener('keydown', (e) => {
            const payload = { type: "input", key: e.code };
            this.socket.send(JSON.stringify(payload));
        });
    }

    updateShipStates(shipStates) {
        for (let [id, state] of Object.entries(shipStates)) {
            if (!this.ships[id]) {
                this.ships[id] = new Ship(new Vector2(0, 0), '#14FF14');
            }
            const ship = this.ships[id];
            ship.position = new Vector2(state.x, state.y);
            ship.angle = state.angle;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let bh of this.blackholes) bh.draw(this.ctx);
        for (let ship of Object.values(this.ships)) ship.draw(this.ctx);
    }

    loop = (now) => {
        this.draw();
        requestAnimationFrame(this.loop);
    };

    start() {
        requestAnimationFrame(this.loop);
    }
}
