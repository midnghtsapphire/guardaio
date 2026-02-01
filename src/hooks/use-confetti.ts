import confetti from "canvas-confetti";

type ConfettiOptions = {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
  duration?: number;
};

const defaults: ConfettiOptions = {
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: ["#22c55e", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
};

export const fireConfetti = (options?: ConfettiOptions) => {
  const config = { ...defaults, ...options };
  
  confetti({
    particleCount: config.particleCount,
    spread: config.spread,
    origin: config.origin,
    colors: config.colors,
  });
};

export const fireCelebration = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const colors = ["#22c55e", "#10b981", "#34d399", "#0ea5e9", "#06b6d4"];

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  // Initial burst
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6, x: 0.5 },
    colors: colors,
    startVelocity: 30,
    gravity: 0.8,
    ticks: 200,
  });

  // Side cannons
  frame();
};

export const fireStars = () => {
  const colors = ["#22c55e", "#10b981", "#fbbf24", "#f59e0b"];
  
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: colors,
    shapes: ["star" as const],
  };

  const shoot = () => {
    confetti({
      ...defaults,
      particleCount: 20,
      scalar: 1.2,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
    });
    confetti({
      ...defaults,
      particleCount: 15,
      scalar: 0.8,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
    });
  };

  shoot();
  setTimeout(shoot, 200);
  setTimeout(shoot, 400);
};
