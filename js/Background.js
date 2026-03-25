// ============================================================
// Parallax Scrolling Background
// ============================================================

import { CONFIG, COLORS } from './constants.js';

export class Background {
    constructor(assets) {
        this.assets = assets;
        this.floorOffset = 0;
        this.wallOffset = 0;

        // Pre-generate random locker/poster positions for the wall layer
        this.wallElements = [];
        for (let i = 0; i < 30; i++) {
            const x = i * 110 + Math.random() * 40;
            const type = Math.random() < 0.5 ? 'locker' : 'poster';
            this.wallElements.push({ x, type });
        }
    }

    update(speed) {
        this.floorOffset = (this.floorOffset + speed * CONFIG.BG_FLOOR_SPEED) % 32;
        this.wallOffset = (this.wallOffset + speed * CONFIG.BG_WALL_SPEED) % (30 * 110 + 40);
    }

    draw(ctx) {
        const w = CONFIG.BASE_WIDTH;
        const h = CONFIG.BASE_HEIGHT;
        const groundY = CONFIG.GROUND_Y;

        // --- Sky / Wall area ---
        ctx.fillStyle = COLORS.WALL_COLOR;
        ctx.fillRect(0, 0, w, groundY);

        // Wall trim (baseboard)
        ctx.fillStyle = COLORS.WALL_TRIM;
        ctx.fillRect(0, groundY - 6, w, 6);

        // Top trim
        ctx.fillStyle = COLORS.WALL_TRIM;
        ctx.fillRect(0, 0, w, 4);

        // --- Draw wall elements (lockers & posters) ---
        ctx.imageSmoothingEnabled = false;

        for (const el of this.wallElements) {
            let drawX = el.x - this.wallOffset;
            // Wrap around
            const totalWidth = 30 * 110 + 40;
            while (drawX < -80) drawX += totalWidth;
            while (drawX > w + 80) drawX -= totalWidth;

            if (drawX > -80 && drawX < w + 80) {
                if (el.type === 'locker') {
                    const lockerSprite = this.assets.locker;
                    const scale = 3;
                    ctx.drawImage(lockerSprite, drawX, groundY - lockerSprite.height * scale - 6, 
                        lockerSprite.width * scale, lockerSprite.height * scale);
                } else {
                    const posterSprite = this.assets.poster;
                    const scale = 2.5;
                    ctx.drawImage(posterSprite, drawX + 10, groundY - 100 - Math.random() * 0.01,
                        posterSprite.width * scale, posterSprite.height * scale);
                }
            }
        }

        // --- Floor area ---
        ctx.fillStyle = COLORS.FLOOR_COLOR;
        ctx.fillRect(0, groundY, w, CONFIG.FLOOR_HEIGHT);

        // Floor tile pattern
        const tileW = 32;
        const tileH = 16;
        const tileSprite = this.assets.floorTile;
        for (let x = -this.floorOffset; x < w + tileW; x += tileW) {
            for (let y = groundY; y < h; y += tileH) {
                ctx.drawImage(tileSprite, x, y, tileW, tileH);
            }
        }
    }
}
