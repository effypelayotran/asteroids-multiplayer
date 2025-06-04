import { Game } from './src/Game.js';

//const socket = new WebSocket("ws://localhost:8080");
const socket = new WebSocket("wss://asteroids-server.onrender.com");



window.onload = () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const game = new Game(ctx, canvas.width, canvas.height, socket);
    game.start();
};
