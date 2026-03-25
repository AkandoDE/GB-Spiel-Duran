// ============================================================
// Player – Physics, Animation & Drawing
// ============================================================

import { CONFIG, COLORS } from './constants.js';

export class Player {
    constructor(assets) {
        this.assets = assets;
        this.x = CONFIG.PLAYER_X;
        this.y = CONFIG.GROUND_Y;
        this.vy = 0;
        this.onGround = true;
        this.canDoubleJump = true;
        this.lives = CONFIG.MAX_LIVES;
        this.invincible = false;
        this._invTimer = 0;
        this._blinkTimer = 0;
        this._visible = true;

        // Animation
        this._animFrame = 0;
        this._animTimer = 0;
        this._runFrames = ['duranRun1', 'duranRun2'];

        // Sprite dimensions (pixel art size * render scale)
        this.spriteScale = 4;
        this.bodyW = 16 * this.spriteScale;
        this.bodyH = 20 * this.spriteScale;
        this.headW = 12 * this.spriteScale;
        this.headH = 12 * this.spriteScale;

        // Hitbox (slightly smaller than visual for forgiving collisions)
        this.hitbox = {
            x: 0, y: 0,
            w: this.bodyW * 0.6,
            h: (this.bodyH + this.headH) * 0.8,
        };

        // Head image (can be swapped with a real PNG later)
        this.headImage = null;
        this._headLoaded = false;
        this._loadHeadImage();
    }

    _loadHeadImage() {
        const img = new Image();
        img.src = 'assets/head.png';
        img.onload = () => {
            this.headImage = img;
            this._headLoaded = true;
        };
        // If head.png doesn't exist, we use the placeholder
        img.onerror = () => {
            this._headLoaded = false;
        };
    }

    jump(audio) {
        if (this.onGround) {
            this.vy = CONFIG.JUMP_FORCE;
            this.onGround = false;
            this.canDoubleJump = true;
            audio.playJump();
        } else if (this.canDoubleJump) {
            this.vy = CONFIG.DOUBLE_JUMP_FORCE;
            this.canDoubleJump = false;
            audio.playDoubleJump();
        }
    }

    hit(audio) {
        if (this.invincible) return false;
        this.lives--;
        audio.playHit();
        if (this.lives <= 0) return true; // game over
        // Start invincibility
        this.invincible = true;
        this._invTimer = CONFIG.INVINCIBILITY_MS;
        return false;
    }

    reset() {
        this.y = CONFIG.GROUND_Y;
        this.vy = 0;
        this.onGround = true;
        this.canDoubleJump = true;
        this.lives = CONFIG.MAX_LIVES;
        this.invincible = false;
        this._invTimer = 0;
    }

    update(dt) {
        // Gravity
        this.vy += CONFIG.GRAVITY;
        this.y += this.vy;

        // Land on ground
        if (this.y >= CONFIG.GROUND_Y) {
            this.y = CONFIG.GROUND_Y;
            this.vy = 0;
            this.onGround = true;
        }

        // Invincibility timer
        if (this.invincible) {
            this._invTimer -= dt;
            this._blinkTimer += dt;
            this._visible = Math.sin(this._blinkTimer * 0.02) > 0;
            if (this._invTimer <= 0) {
                this.invincible = false;
                this._visible = true;
            }
        }

        // Run animation
        this._animTimer += dt;
        if (this._animTimer > 120) {
            this._animTimer = 0;
            this._animFrame = (this._animFrame + 1) % this._runFrames.length;
        }

        // Update hitbox position
        this.hitbox.x = this.x + (this.bodyW - this.hitbox.w) / 2;
        this.hitbox.y = this.y - this.bodyH - this.headH * 0.6 + (this.bodyH + this.headH) * 0.1;
    }

    draw(ctx) {
        if (!this._visible) return;

        ctx.imageSmoothingEnabled = false;

        const bodySprite = this.onGround
            ? this.assets[this._runFrames[this._animFrame]]
            : this.assets.duranJump;

        const isJumping = !this.onGround;
        const bodyDrawH = isJumping ? 17 * this.spriteScale : this.bodyH;

        // Body position: feet at this.y
        const bodyX = this.x;
        const bodyY = this.y - bodyDrawH;

        ctx.drawImage(bodySprite, bodyX, bodyY, this.bodyW, bodyDrawH);

        // Head position: on top of body, slightly overlapping neck  
        const headX = bodyX + (this.bodyW - this.headW) / 2 - 2;
        const headY = bodyY - this.headH * 0.6;

        if (this._headLoaded && this.headImage) {
            ctx.drawImage(this.headImage, headX, headY, this.headW, this.headH);
        } else {
            ctx.drawImage(this.assets.headPlaceholder, headX, headY, this.headW, this.headH);
        }
    }

    getHitbox() {
        return this.hitbox;
    }
}
