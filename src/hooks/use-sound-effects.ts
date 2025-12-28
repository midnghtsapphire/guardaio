import { useCallback, useRef } from "react";

type SoundType = "safe" | "warning" | "danger" | "click" | "complete";

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.3) => {
      if (!enabledRef.current) return;

      try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        // Fade in and out for smoother sound
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    },
    [getAudioContext]
  );

  const playChord = useCallback(
    (frequencies: number[], duration: number, type: OscillatorType = "sine", volume: number = 0.2) => {
      frequencies.forEach((freq, index) => {
        setTimeout(() => playTone(freq, duration, type, volume), index * 50);
      });
    },
    [playTone]
  );

  const playSafeSound = useCallback(() => {
    // Ascending pleasant chime - C major chord arpeggio
    playChord([523.25, 659.25, 783.99], 0.3, "sine", 0.25);
    setTimeout(() => playTone(1046.5, 0.4, "sine", 0.2), 150);
  }, [playChord, playTone]);

  const playWarningSound = useCallback(() => {
    // Two-tone warning beep
    playTone(440, 0.15, "triangle", 0.3);
    setTimeout(() => playTone(349.23, 0.15, "triangle", 0.3), 180);
    setTimeout(() => playTone(440, 0.15, "triangle", 0.3), 360);
  }, [playTone]);

  const playDangerSound = useCallback(() => {
    // Descending alert tones
    playTone(880, 0.12, "sawtooth", 0.2);
    setTimeout(() => playTone(659.25, 0.12, "sawtooth", 0.2), 120);
    setTimeout(() => playTone(440, 0.12, "sawtooth", 0.2), 240);
    setTimeout(() => playTone(329.63, 0.25, "sawtooth", 0.25), 360);
  }, [playTone]);

  const playClickSound = useCallback(() => {
    playTone(800, 0.05, "sine", 0.15);
  }, [playTone]);

  const playCompleteSound = useCallback(() => {
    // Simple completion ding
    playTone(880, 0.15, "sine", 0.2);
    setTimeout(() => playTone(1174.66, 0.2, "sine", 0.15), 100);
  }, [playTone]);

  const playSound = useCallback(
    (type: SoundType) => {
      switch (type) {
        case "safe":
          playSafeSound();
          break;
        case "warning":
          playWarningSound();
          break;
        case "danger":
          playDangerSound();
          break;
        case "click":
          playClickSound();
          break;
        case "complete":
          playCompleteSound();
          break;
      }
    },
    [playSafeSound, playWarningSound, playDangerSound, playClickSound, playCompleteSound]
  );

  const playAnalysisComplete = useCallback(
    (status: "safe" | "warning" | "danger") => {
      playSound(status);
    },
    [playSound]
  );

  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  const isEnabled = useCallback(() => enabledRef.current, []);

  return {
    playSound,
    playAnalysisComplete,
    setEnabled,
    isEnabled,
  };
};
