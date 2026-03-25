// ============================================================
// Input Handler – Touch, Mouse & Keyboard
// ============================================================

export class InputHandler {
    constructor(canvas) {
        this._callbacks = { jump: [] };

        // Touch
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this._fire('jump');
        }, { passive: false });

        // Prevent iOS long-press context menu & callout
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

        // Mouse (desktop fallback)
        canvas.addEventListener('mousedown', () => this._fire('jump'));

        // Keyboard
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                e.preventDefault();
                this._fire('jump');
            }
        });
    }

    onJump(fn) {
        this._callbacks.jump.push(fn);
    }

    _fire(event) {
        for (const fn of this._callbacks[event]) fn();
    }
}
