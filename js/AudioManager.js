// ============================================================
// Web Audio API – All sounds generated procedurally
// ============================================================

export class AudioManager {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.musicGain = null;
        this.sfxGain = null;
    }

    /** Lazy-init AudioContext on first user gesture */
    _ensure() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.25;
        this.musicGain.connect(this.ctx.destination);
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.4;
        this.sfxGain.connect(this.ctx.destination);
    }

    resume() {
        this._ensure();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        // iOS Safari unlock: play a silent buffer to kick-start audio
        if (!this._unlocked) {
            this._unlocked = true;
            const buf = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
            const src = this.ctx.createBufferSource();
            src.buffer = buf;
            src.connect(this.ctx.destination);
            src.start(0);
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.musicGain) this.musicGain.gain.value = this.muted ? 0 : 0.25;
        if (this.sfxGain) this.sfxGain.gain.value = this.muted ? 0 : 0.4;
    }

    // ---- Sound Effects ----

    _tone(freq, duration, type = 'square', dest = null) {
        this._ensure();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(dest || this.sfxGain);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    }

    playJump() {
        this._ensure();
        this._tone(260, 0.1);
        this._tone(390, 0.15);
    }

    playDoubleJump() {
        this._ensure();
        this._tone(350, 0.08);
        this._tone(520, 0.12);
    }

    playHit() {
        this._ensure();
        // Noise burst
        const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.15, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        src.connect(gain);
        gain.connect(this.sfxGain);
        src.start();
        // Low thud
        this._tone(80, 0.2, 'sine');
    }

    // ---- Music ----

    /** Simple looping chiptune run music */
    startRunMusic() {
        this._ensure();
        this.stopMusic();

        const bpm = 140;
        const beat = 60 / bpm;
        const notes = [
            262, 294, 330, 349, 392, 349, 330, 294,
            262, 330, 392, 440, 392, 330, 294, 262,
        ];

        this._musicInterval = setInterval(() => {
            if (this.muted) return;
            const now = this.ctx.currentTime;
            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                osc.type = 'square';
                osc.frequency.value = freq;
                g.gain.setValueAtTime(0.15, now + i * beat * 0.5);
                g.gain.exponentialRampToValueAtTime(0.001, now + i * beat * 0.5 + beat * 0.45);
                osc.connect(g);
                g.connect(this.musicGain);
                osc.start(now + i * beat * 0.5);
                osc.stop(now + i * beat * 0.5 + beat * 0.5);
            });
        }, notes.length * beat * 0.5 * 1000);

        // Play first loop immediately
        const now = this.ctx.currentTime;
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            g.gain.setValueAtTime(0.15, now + i * beat * 0.5);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * beat * 0.5 + beat * 0.45);
            osc.connect(g);
            g.connect(this.musicGain);
            osc.start(now + i * beat * 0.5);
            osc.stop(now + i * beat * 0.5 + beat * 0.5);
        });
    }

    /** 8-bit Happy Birthday melody */
    startBirthdayMusic() {
        this._ensure();
        this.stopMusic();

        const bpm = 100;
        const beat = 60 / bpm;
        // Happy Birthday melody: note frequencies & durations in beats
        const melody = [
            [262, 0.75],[262, 0.25],[294, 1],[262, 1],[349, 1],[330, 2],
            [262, 0.75],[262, 0.25],[294, 1],[262, 1],[392, 1],[349, 2],
            [262, 0.75],[262, 0.25],[523, 1],[440, 1],[349, 1],[330, 1],[294, 2],
            [466, 0.75],[466, 0.25],[440, 1],[349, 1],[392, 1],[349, 2],
        ];

        let offset = 0;
        const now = this.ctx.currentTime;
        melody.forEach(([freq, dur]) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            const start = now + offset * beat;
            g.gain.setValueAtTime(0.2, start);
            g.gain.exponentialRampToValueAtTime(0.001, start + dur * beat * 0.9);
            osc.connect(g);
            g.connect(this.musicGain);
            osc.start(start);
            osc.stop(start + dur * beat);
            offset += dur;
        });

        // Loop after full melody
        const totalDuration = offset * beat * 1000;
        this._musicInterval = setInterval(() => {
            if (this.muted) return;
            let off = 0;
            const n = this.ctx.currentTime;
            melody.forEach(([freq, dur]) => {
                const osc = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                osc.type = 'square';
                osc.frequency.value = freq;
                const s = n + off * beat;
                g.gain.setValueAtTime(0.2, s);
                g.gain.exponentialRampToValueAtTime(0.001, s + dur * beat * 0.9);
                osc.connect(g);
                g.connect(this.musicGain);
                osc.start(s);
                osc.stop(s + dur * beat);
                off += dur;
            });
        }, totalDuration);
    }

    /** Fade out music volume over `duration` seconds */
    fadeOutMusic(duration = 1.5) {
        if (!this.musicGain) return;
        this.musicGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
    }

    stopMusic() {
        if (this._musicInterval) {
            clearInterval(this._musicInterval);
            this._musicInterval = null;
        }
        if (this.musicGain) {
            this.musicGain.gain.cancelScheduledValues(0);
            this.musicGain.gain.value = this.muted ? 0 : 0.25;
        }
    }
}
