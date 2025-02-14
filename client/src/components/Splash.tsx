
import React, { useEffect, useRef, useState } from "react";

export function Splash({ onFinish }: { onFinish: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const speed = useRef(0.5);
  const [isSystemReady, setIsSystemReady] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading Xivi Spaces 15.2");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars: Star[] = [];
    const numStars = 200;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    for (let i = 0; i < numStars; i++) {
      stars.push(new Star(canvas.width, canvas.height));
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      speed.current = 0.5 + (Math.abs(e.movementX) + Math.abs(e.movementY)) * 0.01;
    };

    document.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.9)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.move(canvas.width, canvas.height);
        star.show(ctx, canvas.width, canvas.height);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleClick = () => {
    if (!isSystemReady) return;
    document.documentElement.requestFullscreen().catch(console.warn);
    setTimeout(onFinish, 500);
  };

  class Star {
    x: number;
    y: number;
    z: number;
    size: number;
    speed: number;
    opacity: number;

    constructor(width: number, height: number) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.z = Math.random() * width;
      this.size = 0.5 + Math.random();
      this.speed = 0.2 + Math.random() * 0.5;
      this.opacity = 0.5 + Math.random() * 0.5;
    }

    move(width: number, height: number) {
      this.z = this.z - this.speed * speed.current;
      if (this.z <= 0) {
        this.z = width;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
      }
    }

    show(ctx: CanvasRenderingContext2D, width: number, height: number) {
      let x = (this.x - width / 2) * (width / this.z);
      x = x + width / 2;

      let y = (this.y - height / 2) * (width / this.z);
      y = y + height / 2;

      const s = this.size * (width / this.z);

      x += (mouseX.current - width / 2) * this.speed * 0.1;
      y += (mouseY.current - height / 2) * this.speed * 0.1;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.arc(x, y, s, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  useEffect(() => {
    setLoadingText("Loading Xivi Spaces 15.2");
    const timer = setTimeout(() => setIsSystemReady(true), 3000);
    setLoadingText("Welcome to Xivi");
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] cursor-pointer overflow-hidden bg-zinc-950" onClick={handleClick}>
      <canvas ref={canvasRef} className="absolute inset-0 backdrop-blur-sm" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center space-y-4 backdrop-blur-sm bg-black/80 p-8 rounded-xl w-[600px] transition-all duration-500 ease-in-out">
            <h1 className="text-3xl font-extralight text-white/80 mb-6 text-center tracking-wide bg-white/5 py-2 px-6 rounded-3xl font-['Arial']">
              Xivi Spaces 15.2
            </h1>
            <div className="text-white/80 text-lg font-['Arial']">{loadingText}</div>
            {!isSystemReady && (
              <div className="w-8 h-8 border-2 border-zinc-600 border-t-transparent rounded-full mx-auto animate-spin" />
            )}
            {isSystemReady && (
              <p className="text-zinc-400 mt-6 text-center opacity-0 animate-fade-in">
                Click anywhere to start
              </p>
            )}
          </div>
        </div>
    </div>
  );
}
