// ============================================================
// Birthday Finale – Cake, Confetti & Message
// ============================================================

import { CONFIG, COLORS } from './constants.js';

class ConfettiParticle {
    constructor(w, h) {
        this.x = Math.random() * w;
        this.y = -10 - Math.random() * h;
        this.size = 3 + Math.random() * 5;
        this.speedY = 0.8 + Math.random() * 1.5;
        this.speedX = (Math.random() - 0.5) * 1.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.08;
        const palette = [COLORS.SCHOOL_BLUE, COLORS.SCHOOL_GRAY, COLORS.SCHOOL_WHITE,
                         COLORS.CAKE_FROSTING, COLORS.CANDLE_YELLOW];
        this.color = palette[Math.floor(Math.random() * palette.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotSpeed;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.5);
        ctx.restore();
    }
}

export class Finale {
    constructor(assets) {
        this.assets = assets;
        this.confetti = [];
        this.cakeX = 0;
        this.cakeTargetX = 0;
        this.playerTargetX = 0;
        this.textAlpha = 0;
        this._phase = 0; // 0 = cake scroll in, 1 = player walk, 2 = text + confetti
        this._timer = 0;
        this.active = false;
    }

    start() {
        this.active = true;
        this._phase = 0;
        this._timer = 0;
        this.cakeX = CONFIG.BASE_WIDTH + 50;
        this.cakeTargetX = CONFIG.BASE_WIDTH * 0.65;
        this.playerTargetX = CONFIG.BASE_WIDTH * 0.65 - 100;
        this.textAlpha = 0;
        this.confetti = [];

        // Pre-spawn confetti
        for (let i = 0; i < 120; i++) {
            this.confetti.push(new ConfettiParticle(CONFIG.BASE_WIDTH, CONFIG.BASE_HEIGHT));
        }
    }

    reset() {
        this.active = false;
        this.confetti = [];
        this._phase = 0;
        this._timer = 0;
        this.textAlpha = 0;
    }

    update(dt, player) {
        if (!this.active) return;

        this._timer += dt;

        // Phase 0: Cake slides in from right
        if (this._phase === 0) {
            this.cakeX += (this.cakeTargetX - this.cakeX) * 0.04;
            if (Math.abs(this.cakeX - this.cakeTargetX) < 2) {
                this.cakeX = this.cakeTargetX;
                this._phase = 1;
                this._timer = 0;
            }
        }

        // Phase 1: Player walks toward cake
        if (this._phase === 1) {
            player.x += (this.playerTargetX - player.x) * 0.05;
            if (Math.abs(player.x - this.playerTargetX) < 2) {
                player.x = this.playerTargetX;
                this._phase = 2;
                this._timer = 0;
            }
        }

        // Phase 2: Confetti & text
        if (this._phase === 2) {
            this.textAlpha = Math.min(1, this.textAlpha + 0.015);

            // Spawn more confetti over time
            if (this.confetti.length < 200 && Math.random() < 0.3) {
                this.confetti.push(new ConfettiParticle(CONFIG.BASE_WIDTH, 10));
            }
        }

        // Update confetti
        for (const c of this.confetti) c.update();
        // Recycle confetti that fell off
        for (const c of this.confetti) {
            if (c.y > CONFIG.BASE_HEIGHT + 20) {
                c.y = -10;
                c.x = Math.random() * CONFIG.BASE_WIDTH;
            }
        }
    }

    draw(ctx) {
        if (!this.active) return;

        // Draw stage platform
        const stageW = 200;
        const stageH = 20;
        const stageX = this.cakeX - 40;
        const stageY = CONFIG.GROUND_Y - stageH;

        ctx.fillStyle = COLORS.STAGE_WOOD;
        ctx.fillRect(stageX, stageY, stageW, stageH);
        ctx.fillStyle = COLORS.STAGE_DARK;
        ctx.fillRect(stageX, stageY, stageW, 3);
        ctx.fillRect(stageX, stageY + stageH - 2, stageW, 2);

        // Draw cake
        const cakeSprite = this.assets.cake;
        const cakeScale = 5;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(cakeSprite,
            this.cakeX, stageY - cakeSprite.height * cakeScale,
            cakeSprite.width * cakeScale, cakeSprite.height * cakeScale);

        // Draw confetti
        for (const c of this.confetti) c.draw(ctx);

        // Draw text
        if (this._phase === 2 && this.textAlpha > 0) {
            ctx.save();
            ctx.globalAlpha = this.textAlpha;
            ctx.font = '24px "Press Start 2P", monospace';
            ctx.textAlign = 'center';

            const cx = CONFIG.BASE_WIDTH / 2;

            // Shadow
            ctx.fillStyle = COLORS.TEXT_SHADOW;
            ctx.fillText('Level COMPLETE!', cx + 2, 82);
            ctx.fillStyle = COLORS.CANDLE_YELLOW;
            ctx.fillText('Level COMPLETE!', cx, 80);

            ctx.font = '11px "Press Start 2P", monospace';

            ctx.fillStyle = COLORS.TEXT_SHADOW;
            ctx.fillText('Harrison Central is run by the', cx + 1, 122);
            ctx.fillStyle = COLORS.TEXT_WHITE;
            ctx.fillText('Harrison Central is run by the', cx, 121);

            ctx.fillStyle = COLORS.TEXT_SHADOW;
            ctx.fillText('BEST Superintendent!', cx + 1, 147);
            ctx.fillStyle = COLORS.CAKE_FROSTING;
            ctx.fillText('BEST Superintendent!', cx, 146);

            ctx.font = '18px "Press Start 2P", monospace';
            ctx.fillStyle = COLORS.TEXT_SHADOW;
            ctx.fillText('Happy Birthday, Duran!', cx + 2, 190);
            ctx.fillStyle = COLORS.TEXT_WHITE;
            ctx.fillText('Happy Birthday, Duran!', cx, 188);

            ctx.restore();
        }
    }
}
