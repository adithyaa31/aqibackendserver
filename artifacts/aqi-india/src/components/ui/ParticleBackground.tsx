import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  drift: number;
  driftSpeed: number;
  driftAngle: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const PARTICLE_COUNT = 55;
    let particles: Particle[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticle(): Particle {
      return {
        x: Math.random() * (canvas?.width ?? window.innerWidth),
        y: (canvas?.height ?? window.innerHeight) + Math.random() * 200,
        radius: 0.8 + Math.random() * 2.2,
        opacity: 0.04 + Math.random() * 0.1,
        speed: 0.2 + Math.random() * 0.5,
        drift: 0,
        driftSpeed: 0.003 + Math.random() * 0.008,
        driftAngle: Math.random() * Math.PI * 2,
      };
    }

    function init() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => {
        const p = createParticle();
        p.y = Math.random() * (canvas?.height ?? window.innerHeight);
        return p;
      });
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(30, 30, 30, ${p.opacity})`;
        ctx.fill();

        p.y -= p.speed;
        p.driftAngle += p.driftSpeed;
        p.x += Math.sin(p.driftAngle) * 0.4;

        if (p.y < -10) {
          const np = createParticle();
          p.x = np.x;
          p.y = np.y;
          p.radius = np.radius;
          p.opacity = np.opacity;
          p.speed = np.speed;
          p.driftAngle = np.driftAngle;
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 1,
      }}
    />
  );
}
