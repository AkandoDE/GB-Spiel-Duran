// ============================================================
// Programmatic Pixel Art Sprite Generation
// All sprites are drawn on small offscreen canvases
// and rendered scaled up with imageSmoothingEnabled = false
// for the authentic pixel art look.
// ============================================================

import { COLORS } from './constants.js';

/** Create a small offscreen canvas and draw on it */
function sprite(w, h, drawFn) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    drawFn(ctx);
    return c;
}

/**
 * Generate all pixel art assets for the game.
 * Returns an object with named sprite canvases.
 */
export function generateAssets() {
    const assets = {};

    // Shorthand color aliases
    const suit   = COLORS.SUIT_DARK;
    const pant   = COLORS.SUIT_MID;
    const shirt  = COLORS.SHIRT_WHITE;
    const tie    = COLORS.TIE_RED;
    const belt   = COLORS.SHOE_BLACK;
    const shoe   = COLORS.SHOE_BLACK;
    const skin   = COLORS.SKIN;
    const cup    = COLORS.COFFEE_CUP;
    const coffee = COLORS.COFFEE_LIQUID;

    // ==========================================================
    // DURAN CHARACTER BODY (16 x 20, no head)
    // ==========================================================

    function drawDuranBody(ctx, frame) {
        // Neck
        ctx.fillStyle = skin;
        ctx.fillRect(5, 0, 4, 2);

        // Shoulders
        ctx.fillStyle = suit;
        ctx.fillRect(2, 2, 10, 2);

        // Shirt collar
        ctx.fillStyle = shirt;
        ctx.fillRect(5, 2, 4, 2);

        // Torso (jacket)
        ctx.fillStyle = suit;
        ctx.fillRect(3, 4, 8, 5);

        // Shirt under jacket
        ctx.fillStyle = shirt;
        ctx.fillRect(5, 4, 4, 3);

        // Tie (drawn on top)
        ctx.fillStyle = tie;
        ctx.fillRect(6, 3, 2, 5);

        // Left arm
        ctx.fillStyle = suit;
        ctx.fillRect(1, 3, 2, 5);
        ctx.fillStyle = skin;
        ctx.fillRect(1, 8, 2, 1);

        // Right arm (holding coffee)
        ctx.fillStyle = suit;
        ctx.fillRect(11, 3, 2, 4);
        ctx.fillStyle = skin;
        ctx.fillRect(11, 7, 2, 1);

        // Coffee cup
        ctx.fillStyle = cup;
        ctx.fillRect(13, 5, 2, 3);
        ctx.fillStyle = coffee;
        ctx.fillRect(13, 5, 2, 1);
        // Cup handle
        ctx.fillStyle = cup;
        ctx.fillRect(15, 6, 1, 1);

        // Belt
        ctx.fillStyle = belt;
        ctx.fillRect(3, 9, 8, 1);

        // Legs & shoes based on animation frame
        ctx.fillStyle = pant;

        if (frame === 'run1') {
            // Stride: legs apart
            ctx.fillRect(3, 10, 3, 8);
            ctx.fillRect(8, 10, 3, 8);
            ctx.fillStyle = shoe;
            ctx.fillRect(2, 18, 4, 2);
            ctx.fillRect(8, 18, 3, 2);
        } else if (frame === 'run2') {
            // Legs closer (mid-stride)
            ctx.fillRect(4, 10, 3, 8);
            ctx.fillRect(7, 10, 3, 8);
            ctx.fillStyle = shoe;
            ctx.fillRect(4, 18, 3, 2);
            ctx.fillRect(7, 18, 3, 2);
        } else if (frame === 'jump') {
            // Legs tucked up
            ctx.fillRect(3, 10, 4, 5);
            ctx.fillRect(7, 10, 4, 5);
            ctx.fillStyle = shoe;
            ctx.fillRect(3, 15, 4, 2);
            ctx.fillRect(7, 15, 4, 2);
        }
    }

    assets.duranRun1 = sprite(16, 20, ctx => drawDuranBody(ctx, 'run1'));
    assets.duranRun2 = sprite(16, 20, ctx => drawDuranBody(ctx, 'run2'));
    assets.duranJump = sprite(16, 20, ctx => {
        drawDuranBody(ctx, 'jump');
        // Coffee splash effect
        ctx.fillStyle = coffee;
        ctx.fillRect(12, 3, 1, 1);
        ctx.fillRect(14, 2, 1, 1);
        ctx.fillRect(15, 3, 1, 1);
    });

    // ==========================================================
    // HEAD PLACEHOLDER (12 x 12, replaced by actual PNG)
    // ==========================================================

    assets.headPlaceholder = sprite(12, 12, ctx => {
        // Round face
        ctx.fillStyle = skin;
        ctx.fillRect(2, 2, 8, 8);
        ctx.fillRect(3, 1, 6, 1);
        ctx.fillRect(3, 10, 6, 1);
        ctx.fillRect(1, 3, 1, 6);
        ctx.fillRect(10, 3, 1, 6);
        // Hair
        ctx.fillStyle = '#222';
        ctx.fillRect(2, 1, 8, 2);
        ctx.fillRect(1, 2, 1, 2);
        ctx.fillRect(10, 2, 1, 2);
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(4, 4, 1, 2);
        ctx.fillRect(7, 4, 1, 2);
        // Smile
        ctx.fillRect(4, 7, 4, 1);
        ctx.fillRect(3, 6, 1, 1);
        ctx.fillRect(8, 6, 1, 1);
    });

    // ==========================================================
    // OBSTACLES
    // ==========================================================

    // Paperwork Avalanche (16 x 12)
    assets.paperwork = sprite(16, 12, ctx => {
        // Shadow/base
        ctx.fillStyle = COLORS.PAPER_SHADOW;
        ctx.fillRect(1, 3, 14, 9);
        // Stack of papers at different angles
        ctx.fillStyle = COLORS.PAPER_WHITE;
        ctx.fillRect(0, 4, 14, 8);
        ctx.fillRect(2, 2, 13, 8);
        ctx.fillRect(1, 0, 12, 8);
        // Lines on paper
        ctx.fillStyle = COLORS.PAPER_LINE;
        for (let y = 2; y < 8; y += 2) {
            ctx.fillRect(2, y, 8, 1);
        }
        // Red stamp/marks
        ctx.fillStyle = COLORS.TIE_RED;
        ctx.fillRect(11, 3, 2, 2);
        ctx.fillRect(4, 7, 3, 1);
        // "BUDGET" text hint
        ctx.fillStyle = COLORS.PAPER_LINE;
        ctx.fillRect(2, 9, 6, 1);
    });

    // Snow Day pile (20 x 14)
    assets.snow = sprite(20, 14, ctx => {
        // Snow mound shadow
        ctx.fillStyle = COLORS.SNOW_SHADOW;
        ctx.fillRect(2, 8, 16, 6);
        ctx.fillRect(4, 6, 12, 2);
        ctx.fillRect(6, 5, 8, 1);
        // Snow mound
        ctx.fillStyle = COLORS.SNOW_WHITE;
        ctx.fillRect(2, 9, 16, 5);
        ctx.fillRect(4, 7, 12, 2);
        ctx.fillRect(6, 6, 8, 1);
        ctx.fillRect(8, 5, 4, 1);
        // Sparkle highlights
        ctx.fillStyle = '#fff';
        ctx.fillRect(5, 8, 1, 1);
        ctx.fillRect(10, 7, 1, 1);
        ctx.fillRect(14, 9, 1, 1);
        // Sign post
        ctx.fillStyle = COLORS.SIGN_WOOD;
        ctx.fillRect(9, 1, 2, 9);
        // Sign board
        ctx.fillStyle = COLORS.PAPER_WHITE;
        ctx.fillRect(5, 0, 10, 5);
        ctx.fillStyle = COLORS.SIGN_WOOD;
        ctx.fillRect(5, 0, 10, 1);
        // "?" on sign
        ctx.fillStyle = COLORS.SCHOOL_BLUE;
        ctx.fillRect(8, 1, 1, 1);
        ctx.fillRect(9, 1, 1, 1);
        ctx.fillRect(9, 2, 1, 1);
        ctx.fillRect(8, 3, 1, 1);
        ctx.fillRect(8, 4, 1, 0.5);
    });

    // Paper Plane (12 x 8)
    assets.paperPlane = sprite(12, 8, ctx => {
        ctx.fillStyle = COLORS.PAPER_WHITE;
        // Main body
        ctx.fillRect(0, 3, 12, 2);
        // Upper wing
        ctx.fillRect(1, 2, 8, 1);
        ctx.fillRect(2, 1, 5, 1);
        ctx.fillRect(3, 0, 3, 1);
        // Lower wing
        ctx.fillRect(1, 5, 8, 1);
        ctx.fillRect(2, 6, 5, 1);
        ctx.fillRect(3, 7, 3, 1);
        // Nose (pointed)
        ctx.fillRect(10, 3, 2, 2);
        ctx.fillRect(11, 2, 1, 4);
        // Fold line
        ctx.fillStyle = COLORS.PAPER_LINE;
        ctx.fillRect(1, 3, 10, 1);
        // Tail
        ctx.fillStyle = COLORS.PAPER_SHADOW;
        ctx.fillRect(0, 2, 1, 4);
    });

    // Football (10 x 6)
    assets.football = sprite(10, 6, ctx => {
        // Ball body
        ctx.fillStyle = COLORS.FOOTBALL_BROWN;
        ctx.fillRect(2, 1, 6, 4);
        ctx.fillRect(1, 2, 8, 2);
        ctx.fillRect(0, 2, 1, 2);
        ctx.fillRect(9, 2, 1, 2);
        // Darker edges
        ctx.fillStyle = COLORS.FOOTBALL_DARK;
        ctx.fillRect(2, 1, 6, 1);
        ctx.fillRect(2, 4, 6, 1);
        // Laces
        ctx.fillStyle = COLORS.FOOTBALL_LACE;
        ctx.fillRect(3, 2, 4, 1);
        ctx.fillRect(4, 1, 1, 4);
        ctx.fillRect(6, 1, 1, 4);
    });

    // ==========================================================
    // BACKGROUND TILES
    // ==========================================================

    // Floor tile (32 x 16)
    assets.floorTile = sprite(32, 16, ctx => {
        ctx.fillStyle = COLORS.FLOOR_COLOR;
        ctx.fillRect(0, 0, 32, 16);
        // Grid lines
        ctx.fillStyle = COLORS.FLOOR_LINE;
        ctx.fillRect(0, 0, 32, 1);
        ctx.fillRect(16, 0, 1, 16);
        // Subtle wear marks
        ctx.fillStyle = '#989898';
        ctx.fillRect(5, 5, 2, 1);
        ctx.fillRect(22, 10, 3, 1);
    });

    // Locker (16 x 40)
    assets.locker = sprite(16, 40, ctx => {
        // Main body
        ctx.fillStyle = COLORS.LOCKER_BODY;
        ctx.fillRect(0, 0, 16, 40);
        // Frame/edges
        ctx.fillStyle = COLORS.LOCKER_DARK;
        ctx.fillRect(0, 0, 16, 1);   // top
        ctx.fillRect(0, 0, 1, 40);   // left
        ctx.fillRect(15, 0, 1, 40);  // right
        ctx.fillRect(0, 39, 16, 1);  // bottom
        ctx.fillRect(0, 19, 16, 2);  // divider
        // Vent slots (top locker)
        ctx.fillStyle = COLORS.LOCKER_DARK;
        for (let y = 4; y < 16; y += 3) {
            ctx.fillRect(3, y, 10, 1);
        }
        // Vent slots (bottom locker)
        for (let y = 24; y < 36; y += 3) {
            ctx.fillRect(3, y, 10, 1);
        }
        // Handles
        ctx.fillStyle = COLORS.LOCKER_HANDLE;
        ctx.fillRect(12, 10, 2, 3);
        ctx.fillRect(12, 30, 2, 3);
        // Handle shadow
        ctx.fillStyle = COLORS.LOCKER_DARK;
        ctx.fillRect(12, 13, 2, 1);
        ctx.fillRect(12, 33, 2, 1);
    });

    // Huskie Poster (14 x 18)
    assets.poster = sprite(14, 18, ctx => {
        // Paper background
        ctx.fillStyle = COLORS.SCHOOL_WHITE;
        ctx.fillRect(0, 0, 14, 18);
        // Blue border
        ctx.fillStyle = COLORS.SCHOOL_BLUE;
        ctx.fillRect(0, 0, 14, 1);
        ctx.fillRect(0, 17, 14, 1);
        ctx.fillRect(0, 0, 1, 18);
        ctx.fillRect(13, 0, 1, 18);
        // Huskie silhouette
        ctx.fillStyle = COLORS.SCHOOL_BLUE;
        ctx.fillRect(5, 3, 5, 4);  // body
        ctx.fillRect(3, 3, 3, 3);  // head
        ctx.fillRect(3, 2, 1, 1);  // left ear
        ctx.fillRect(5, 2, 1, 1);  // right ear
        ctx.fillRect(4, 7, 2, 3);  // front legs
        ctx.fillRect(8, 7, 2, 3);  // back legs
        ctx.fillRect(10, 4, 2, 2); // tail up
        // "GO HUSKIES" text bars
        ctx.fillStyle = COLORS.TIE_RED;
        ctx.fillRect(2, 12, 10, 1);
        ctx.fillRect(3, 14, 8, 1);
    });

    // ==========================================================
    // FINALE ASSETS
    // ==========================================================

    // Birthday Cake (24 x 28)
    assets.cake = sprite(24, 28, ctx => {
        // Bottom tier
        ctx.fillStyle = COLORS.CAKE_BASE;
        ctx.fillRect(2, 18, 20, 10);
        ctx.fillStyle = COLORS.CAKE_FROSTING;
        ctx.fillRect(2, 18, 20, 3);
        // Frosting drips
        ctx.fillRect(4, 21, 2, 2);
        ctx.fillRect(10, 21, 2, 2);
        ctx.fillRect(16, 21, 2, 2);

        // Middle tier
        ctx.fillStyle = COLORS.CAKE_LAYER;
        ctx.fillRect(5, 11, 14, 7);
        ctx.fillStyle = COLORS.CAKE_FROSTING;
        ctx.fillRect(5, 11, 14, 2);
        ctx.fillRect(7, 13, 2, 2);
        ctx.fillRect(13, 13, 2, 2);

        // Top tier
        ctx.fillStyle = COLORS.CAKE_BASE;
        ctx.fillRect(8, 5, 8, 6);
        ctx.fillStyle = COLORS.CAKE_FROSTING;
        ctx.fillRect(8, 5, 8, 2);

        // Candles
        ctx.fillStyle = COLORS.CANDLE_YELLOW;
        ctx.fillRect(9, 2, 1, 3);
        ctx.fillRect(12, 2, 1, 3);
        ctx.fillRect(15, 2, 1, 3);
        // Flames
        ctx.fillStyle = COLORS.FLAME_ORANGE;
        ctx.fillRect(9, 0, 1, 2);
        ctx.fillRect(12, 0, 1, 2);
        ctx.fillRect(15, 0, 1, 2);
        // Flame tips
        ctx.fillStyle = COLORS.CANDLE_YELLOW;
        ctx.fillRect(9, 0, 1, 1);
        ctx.fillRect(12, 0, 1, 1);
        ctx.fillRect(15, 0, 1, 1);

        // Plate
        ctx.fillStyle = COLORS.SCHOOL_WHITE;
        ctx.fillRect(0, 27, 24, 1);
    });

    // Heart for lives HUD (7 x 7)
    assets.heart = sprite(7, 7, ctx => {
        ctx.fillStyle = COLORS.HEART_RED;
        ctx.fillRect(1, 0, 2, 2);
        ctx.fillRect(4, 0, 2, 2);
        ctx.fillRect(0, 1, 7, 2);
        ctx.fillRect(1, 3, 5, 2);
        ctx.fillRect(2, 5, 3, 1);
        ctx.fillRect(3, 6, 1, 1);
        // Highlight
        ctx.fillStyle = COLORS.HEART_HIGHLIGHT;
        ctx.fillRect(1, 0, 1, 1);
        ctx.fillRect(4, 0, 1, 1);
    });

    return assets;
}
