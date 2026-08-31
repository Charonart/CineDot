/**
 * Web Audio API Sound Synthesizer for Ticket Scanner
 * Provides zero-dependency, non-intrusive auditory feedback for cinema staff.
 */

class ScannerAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Sound 1: Valid Ticket Lookup Beep (Crisp pleasant double-chime)
   */
  public playScanSuccess(): void {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.setValueAtTime(1318.51, now + 0.06); // E6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Ignore audio synthesis errors on unsupported browsers
    }
  }

  /**
   * Sound 2: Check-In Confirmed Success Chime (3-tone uplifting progression)
   */
  public playCheckInSuccess(): void {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      const noteDuration = 0.08;

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * noteDuration);

        gain.gain.setValueAtTime(0.14, now + idx * noteDuration);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * noteDuration + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * noteDuration);
        osc.stop(now + (idx + 1) * noteDuration + 0.06);
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Sound 3: Error / Duplicate / Invalid Ticket Buzz (Low warning tone)
   */
  public playScanError(): void {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.setValueAtTime(180, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Sound 4: F&B Combo Claim Chime (Bubble pop chime)
   */
  public playClaimCombo(): void {
    if (!this.isEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1046.5, now); // C6
      osc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.08); // G6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // Ignore audio errors
    }
  }
}

export const scannerAudio = new ScannerAudioSynthesizer();
