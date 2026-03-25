// ============================================================
// Obstacle Spawning & Management
// ============================================================

import { CONFIG, OBSTACLE_TYPE } from './constants.js';

class Obstacle {
    constructor(type, x, y, sprite, speed, spriteScale) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.speed = speed;
        this.scale = spriteScale;
        this.w = sprite.width * spriteScale;
        this.h = sprite.height * spriteScale;
        this.active = true;

        // Slight variations for air obstacles
        this.wobbleOffset = 0;
        this.wobbleSpeed = 0;
        if (type === OBSTACLE_TYPE.PAPER_PLANE || type === OBSTACLE_TYPE.FOOTBALL) {
            this.wobbleSpeed = 0.03 + Math.random() * 0.02;
        }

        this._time = 0;
    }

    update(speed) {
        this.x -= speed;
        this._time++;

        // Wobble for air obstacles
        if (this.wobbleSpeed > 0) {
            this.wobbleOffset = Math.sin(this._time * this.wobbleSpeed) * 8;
        }

        if (this.x + this.w < -50) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.sprite, this.x, this.y + this.wobbleOffset, this.w, this.h);
    }

    getHitbox() {
        const margin = 4;
        return {
            x: this.x + margin,
            y: this.y + this.wobbleOffset + margin,
            w: this.w - margin * 2,
            h: this.h - margin * 2,
        };
    }
}

export class ObstacleManager {
    constructor(assets) {
        this.assets = assets;
        this.obstacles = [];
        this._spawnTimer = 0;
        this._nextSpawn = this._randomInterval();
        this.enabled = true;
    }

    _randomInterval() {
        return CONFIG.SPAWN_MIN_INTERVAL + Math.random() * (CONFIG.SPAWN_MAX_INTERVAL - CONFIG.SPAWN_MIN_INTERVAL);
    }

    reset() {
        this.obstacles = [];
        this._spawnTimer = 0;
        this._nextSpawn = this._randomInterval();
        this.enabled = true;
    }

    update(dt, speed) {
        if (!this.enabled) {
            // Still move existing obstacles off screen
            for (const obs of this.obstacles) obs.update(speed);
            this.obstacles = this.obstacles.filter(o => o.active);
            return;
        }

        this._spawnTimer += dt;
        if (this._spawnTimer >= this._nextSpawn) {
            this._spawnTimer = 0;
            this._nextSpawn = this._randomInterval();
            this._spawn(speed);
        }

        for (const obs of this.obstacles) obs.update(speed);
        this.obstacles = this.obstacles.filter(o => o.active);
    }

    _spawn(speed) {
        const types = [
            OBSTACLE_TYPE.PAPERWORK,
            OBSTACLE_TYPE.SNOW,
            OBSTACLE_TYPE.PAPER_PLANE,
            OBSTACLE_TYPE.FOOTBALL,
        ];
        const type = types[Math.floor(Math.random() * types.length)];
        const startX = CONFIG.BASE_WIDTH + 20;
        const scale = 4;

        let sprite, y;

        switch (type) {
            case OBSTACLE_TYPE.PAPERWORK:
                sprite = this.assets.paperwork;
                y = CONFIG.GROUND_Y - sprite.height * scale;
                break;
            case OBSTACLE_TYPE.SNOW:
                sprite = this.assets.snow;
                y = CONFIG.GROUND_Y - sprite.height * scale;
                break;
            case OBSTACLE_TYPE.PAPER_PLANE:
                sprite = this.assets.paperPlane;
                y = CONFIG.GROUND_Y - 180 - Math.random() * 80;
                break;
            case OBSTACLE_TYPE.FOOTBALL:
                sprite = this.assets.football;
                y = CONFIG.GROUND_Y - 170 - Math.random() * 90;
                break;
        }

        this.obstacles.push(new Obstacle(type, startX, y, sprite, speed, scale));
    }

    draw(ctx) {
        for (const obs of this.obstacles) obs.draw(ctx);
    }

    checkCollision(playerHitbox) {
        for (const obs of this.obstacles) {
            if (!obs.active) continue;
            const oh = obs.getHitbox();
            if (
                playerHitbox.x < oh.x + oh.w &&
                playerHitbox.x + playerHitbox.w > oh.x &&
                playerHitbox.y < oh.y + oh.h &&
                playerHitbox.y + playerHitbox.h > oh.y
            ) {
                obs.active = false;
                return true;
            }
        }
        return false;
    }
}
