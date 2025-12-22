/**
 * Voice Alert Sound Effects System
 * Provides audio notifications with priority-based chimes
 */

export type SoundType = 'info' | 'warning' | 'critical' | 'success' | 'error' | 'notification';

export interface SoundConfig {
  enabled: boolean;
  volume: number;
}

// Web Audio API context (lazy initialization)
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Generate alert tones using Web Audio API
 */
export class VoiceSounds {
  private config: SoundConfig = {
    enabled: true,
    volume: 0.5
  };

  constructor(config?: Partial<SoundConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Play a tone with specific frequency and duration
   */
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): Promise<void> {
    if (!this.config.enabled) return Promise.resolve();

    return new Promise((resolve) => {
      try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        // Volume envelope (fade in/out)
        const now = ctx.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.config.volume, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);

        oscillator.onended = () => resolve();
      } catch (error) {
        console.error('Error playing tone:', error);
        resolve();
      }
    });
  }

  /**
   * Play multi-tone sequence
   */
  private async playSequence(tones: Array<{ freq: number; duration: number; delay?: number }>): Promise<void> {
    for (const tone of tones) {
      if (tone.delay) {
        await new Promise(resolve => setTimeout(resolve, tone.delay));
      }
      await this.playTone(tone.freq, tone.duration);
    }
  }

  /**
   * Info alert (single gentle beep)
   */
  async playInfo(): Promise<void> {
    await this.playTone(800, 0.1);
  }

  /**
   * Warning alert (two-tone)
   */
  async playWarning(): Promise<void> {
    await this.playSequence([
      { freq: 800, duration: 0.15 },
      { freq: 600, duration: 0.15, delay: 100 }
    ]);
  }

  /**
   * Critical alert (urgent siren)
   */
  async playCritical(): Promise<void> {
    await this.playSequence([
      { freq: 1000, duration: 0.2 },
      { freq: 800, duration: 0.2, delay: 50 },
      { freq: 1000, duration: 0.2, delay: 50 }
    ]);
  }

  /**
   * Success sound (ascending tones)
   */
  async playSuccess(): Promise<void> {
    await this.playSequence([
      { freq: 523, duration: 0.1 },
      { freq: 659, duration: 0.1, delay: 50 },
      { freq: 784, duration: 0.15, delay: 50 }
    ]);
  }

  /**
   * Error sound (descending tones)
   */
  async playError(): Promise<void> {
    await this.playSequence([
      { freq: 400, duration: 0.15 },
      { freq: 300, duration: 0.2, delay: 50 }
    ]);
  }

  /**
   * Notification (gentle double beep)
   */
  async playNotification(): Promise<void> {
    await this.playSequence([
      { freq: 1000, duration: 0.08 },
      { freq: 1000, duration: 0.08, delay: 100 }
    ]);
  }

  /**
   * BOLO hit (distinctive pattern)
   */
  async playBoloHit(): Promise<void> {
    await this.playSequence([
      { freq: 1200, duration: 0.1 },
      { freq: 800, duration: 0.1, delay: 80 },
      { freq: 1200, duration: 0.1, delay: 80 },
      { freq: 800, duration: 0.15, delay: 80 }
    ]);
  }

  /**
   * Panic button (rapid alternating tones)
   */
  async playPanic(): Promise<void> {
    await this.playSequence([
      { freq: 1500, duration: 0.15 },
      { freq: 1000, duration: 0.15, delay: 30 },
      { freq: 1500, duration: 0.15, delay: 30 },
      { freq: 1000, duration: 0.15, delay: 30 },
      { freq: 1500, duration: 0.2, delay: 30 }
    ]);
  }

  /**
   * Play sound by type
   */
  async play(type: SoundType): Promise<void> {
    switch (type) {
      case 'info':
        return this.playInfo();
      case 'warning':
        return this.playWarning();
      case 'critical':
        return this.playCritical();
      case 'success':
        return this.playSuccess();
      case 'error':
        return this.playError();
      case 'notification':
        return this.playNotification();
      default:
        return this.playInfo();
    }
  }

  /**
   * Update sound configuration
   */
  updateConfig(config: Partial<SoundConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): SoundConfig {
    return { ...this.config };
  }
}

// Singleton instance
let soundsInstance: VoiceSounds | null = null;

export function getVoiceSounds(): VoiceSounds {
  if (!soundsInstance) {
    soundsInstance = new VoiceSounds();
  }
  return soundsInstance;
}
