// ============================================================
// Game – Main Orchestrator
// ============================================================

import { CONFIG, GAME_STATE } from './constants.js';
import { generateAssets } from './PixelAssets.js';
import { AudioManager } from './AudioManager.js';
import { InputHandler } from './InputHandler.js';
import { Background } from './Background.js';
import { Player } from './Player.js';
import { ObstacleManager } from './ObstacleManager.js';
import { Finale } from './Finale.js';
import { UI } from './UI.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.state = GAME_STATE.LOADING;
        this.distance = 0;
        this.speed = CONFIG.BASE_SPEED;
        this._lastTimestamp = 0;

        // Generate pixel art assets
        this.assets = generateAssets();

        // Subsystems
        this.audio = new AudioManager();
        this.bg = new Background(this.assets);
        this.player = new Player(this.assets);
        this.obstacles = new ObstacleManager(this.assets);
        this.finale = new Finale(this.assets);
        this.ui = new UI(this.assets);

        // Input
        this.input = new InputHandler(canvas);
        this.input.onJump(() => this._handleInput());

        // Canvas sizing
        this._resize();
        window.addEventListener('resize', () => this._resize());
        // iOS Safari fires visualViewport resize when address bar shows/hides
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => this._resize());
        }

        // Mark ready
        this.state = GAME_STATE.MENU;
    }

    _resize() {
        const ratio = CONFIG.BASE_WIDTH / CONFIG.BASE_HEIGHT;

        // Use visualViewport when available (iOS Safari gives the actual visible area)
        const vp = window.visualViewport;
        let w = vp ? vp.width : window.innerWidth;
        let h = vp ? vp.height : window.innerHeight;

        if (w / h > ratio) {
            w = h * ratio;
        } else {
            h = w / ratio;
        }

        this.canvas.width = CONFIG.BASE_WIDTH;
        this.canvas.height = CONFIG.BASE_HEIGHT;
        this.canvas.style.width = `${Math.floor(w)}px`;
        this.canvas.style.height = `${Math.floor(h)}px`;
    }

    _handleInput() {
        this.audio.resume();

        switch (this.state) {
            case GAME_STATE.MENU:
                this._startGame();
                break;
            case GAME_STATE.PLAYING:
                this.player.jump(this.audio);
                break;
            case GAME_STATE.GAME_OVER:
                this._startGame();
                break;
            case GAME_STATE.FINALE:
                // Do nothing during finale
                break;
        }
    }

    _startGame() {
        this.state = GAME_STATE.PLAYING;
        this.distance = 0;
        this.speed = CONFIG.BASE_SPEED;
        this.player.reset();
        this.player.x = CONFIG.PLAYER_X;
        this.obstacles.reset();
        this.finale.reset();
        this.audio.startRunMusic();
    }

    update(timestamp) {
        const dt = timestamp - this._lastTimestamp;
        this._lastTimestamp = timestamp;

        // Clamp dt to prevent huge jumps on tab-switch
        const clampedDt = Math.min(dt, 50);

        this.ui.update(clampedDt);

        if (this.state === GAME_STATE.PLAYING) {
            // Increase speed over time
            this.speed = Math.min(CONFIG.MAX_SPEED, this.speed + CONFIG.SPEED_INCREMENT * clampedDt);
            this.distance += this.speed * CONFIG.DISTANCE_FACTOR;

            this.bg.update(this.speed);
            this.player.update(clampedDt);
            this.obstacles.update(clampedDt, this.speed);

            // Collision
            if (this.obstacles.checkCollision(this.player.getHitbox())) {
                const dead = this.player.hit(this.audio);
                if (dead) {
                    this.state = GAME_STATE.GAME_OVER;
                    this.audio.stopMusic();
                }
            }

            // Check finale trigger
            if (this.distance >= CONFIG.FINALE_DISTANCE) {
                this.state = GAME_STATE.FINALE_TRANSITION;
                this.obstacles.enabled = false;
                this.audio.fadeOutMusic(2);
                setTimeout(() => {
                    this.audio.stopMusic();
                    this.audio.startBirthdayMusic();
                    this.state = GAME_STATE.FINALE;
                    this.finale.start();
                }, 2000);
            }
        }

        if (this.state === GAME_STATE.FINALE_TRANSITION) {
            this.bg.update(this.speed * 0.5);
            this.player.update(clampedDt);
            this.obstacles.update(clampedDt, this.speed);
            this.speed = Math.max(0, this.speed - 0.02);
        }

        if (this.state === GAME_STATE.FINALE) {
            this.finale.update(clampedDt, this.player);
            this.player.update(clampedDt);
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, CONFIG.BASE_WIDTH, CONFIG.BASE_HEIGHT);

        // Background always draws
        this.bg.draw(ctx);

        switch (this.state) {
            case GAME_STATE.MENU:
                this.player.draw(ctx);
                this.ui.drawStartScreen(ctx);
                break;

            case GAME_STATE.PLAYING:
            case GAME_STATE.FINALE_TRANSITION:
                this.obstacles.draw(ctx);
                this.player.draw(ctx);
                this.ui.drawHUD(ctx, this.player.lives, this.distance);
                break;

            case GAME_STATE.FINALE:
                this.player.draw(ctx);
                this.finale.draw(ctx);
                break;

            case GAME_STATE.GAME_OVER:
                this.obstacles.draw(ctx);
                this.player.draw(ctx);
                this.ui.drawGameOver(ctx);
                break;
        }
    }

    /** Main loop – called by requestAnimationFrame */
    loop(timestamp) {
        this.update(timestamp);
        this.draw();
        requestAnimationFrame((t) => this.loop(t));
    }

    start() {
        requestAnimationFrame((t) => {
            this._lastTimestamp = t;
            this.loop(t);
        });
    }
}
