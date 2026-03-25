// ============================================================
// UI – Start Screen, HUD, Game Over
// ============================================================

import { CONFIG, COLORS, GAME_STATE } from './constants.js';

export class UI {
    constructor(assets) {
        this.assets = assets;
        this._blinkTimer = 0;
        this._showText = true;
    }

    update(dt) {
        this._blinkTimer += dt;
        if (this._blinkTimer > 500) {
            this._blinkTimer = 0;
            this._showText = !this._showText;
        }
    }

    drawStartScreen(ctx) {
        const cx = CONFIG.BASE_WIDTH / 2;

        // Darken
        ctx.fillStyle = 'rgba(0, 20, 50, 0.75)';
        ctx.fillRect(0, 0, CONFIG.BASE_WIDTH, CONFIG.BASE_HEIGHT);

        // Title
        ctx.font = '20px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = COLORS.TEXT_SHADOW;
        ctx.fillText("DURAN'S", cx + 2, 112);
        ctx.fillStyle = COLORS.SCHOOL_BLUE_LIGHT;
        ctx.fillText("DURAN'S", cx, 110);

        ctx.font = '28px "Press Start 2P", monospace';
        ctx.fillStyle = COLORS.TEXT_SHADOW;
        ctx.fillText('HALLWAY DASH', cx + 2, 152);
        ctx.fillStyle = COLORS.CANDLE_YELLOW;
        ctx.fillText('HALLWAY DASH', cx, 150);

        // Subtitle
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillStyle = COLORS.SCHOOL_GRAY_LIGHT;
        ctx.fillText('Harrison Central Highschool', cx, 180);

        // Blink prompt
        if (this._showText) {
            ctx.font = '12px "Press Start 2P", monospace';
            ctx.fillStyle = COLORS.TEXT_WHITE;
            ctx.fillText('TAP / CLICK / SPACE to START', cx, 280);
        }

        // Draw character preview
        ctx.imageSmoothingEnabled = false;
        const previewScale = 5;
        const duranSprite = this.assets.duranRun1;
        const headSprite = this.assets.headPlaceholder;
        const px = cx - (duranSprite.width * previewScale) / 2;
        const py = 310;
        ctx.drawImage(duranSprite, px, py, duranSprite.width * previewScale, duranSprite.height * previewScale);
        ctx.drawImage(headSprite,
            px + ((duranSprite.width - headSprite.width) * previewScale) / 2 - 2,
            py - headSprite.height * previewScale * 0.6,
            headSprite.width * previewScale, headSprite.height * previewScale);
    }

    drawHUD(ctx, lives, distance) {
        // Hearts
        const heartSprite = this.assets.heart;
        const heartScale = 4;
        for (let i = 0; i < CONFIG.MAX_LIVES; i++) {
            ctx.globalAlpha = i < lives ? 1 : 0.25;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(heartSprite,
                12 + i * (heartSprite.width * heartScale + 6), 12,
                heartSprite.width * heartScale, heartSprite.height * heartScale);
        }
        ctx.globalAlpha = 1;

        // Distance
        ctx.font = '12px "Press Start 2P", monospace';
        ctx.textAlign = 'right';
        ctx.fillStyle = COLORS.TEXT_SHADOW;
        ctx.fillText(`${Math.floor(distance)}m`, CONFIG.BASE_WIDTH - 10, 30);
        ctx.fillStyle = COLORS.TEXT_WHITE;
        ctx.fillText(`${Math.floor(distance)}m`, CONFIG.BASE_WIDTH - 12, 28);
        ctx.textAlign = 'left';

        // Progress bar toward finale
        const progress = Math.min(1, distance / CONFIG.FINALE_DISTANCE);
        const barW = 120;
        const barH = 8;
        const barX = CONFIG.BASE_WIDTH / 2 - barW / 2;
        const barY = 14;

        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
        ctx.fillStyle = COLORS.SCHOOL_GRAY;
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = COLORS.SCHOOL_BLUE_LIGHT;
        ctx.fillRect(barX, barY, barW * progress, barH);
        // Cake icon at end
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = COLORS.CANDLE_YELLOW;
        ctx.fillText('🎂', barX + barW + 4, barY + barH);
    }

    drawGameOver(ctx) {
        const cx = CONFIG.BASE_WIDTH / 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(0, 0, CONFIG.BASE_WIDTH, CONFIG.BASE_HEIGHT);

        ctx.font = '22px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = COLORS.TEXT_SHADOW;
        ctx.fillText('OOPS!', cx + 2, 172);
        ctx.fillStyle = COLORS.HEART_RED;
        ctx.fillText('OOPS!', cx, 170);

        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = COLORS.SCHOOL_GRAY_LIGHT;
        ctx.fillText('The hallway got the best of you!', cx, 210);

        if (this._showText) {
            ctx.font = '11px "Press Start 2P", monospace';
            ctx.fillStyle = COLORS.TEXT_WHITE;
            ctx.fillText('TAP to TRY AGAIN', cx, 280);
        }
    }

    drawMuteButton(ctx, muted) {
        ctx.font = '14px "Press Start 2P", monospace';
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(muted ? '🔇' : '🔊', CONFIG.BASE_WIDTH - 12, CONFIG.BASE_HEIGHT - 14);
        ctx.textAlign = 'left';
    }
}
