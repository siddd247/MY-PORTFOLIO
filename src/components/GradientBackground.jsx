import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

export default function GradientBackground() {
  const containerRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);

  const cursorRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const posRefs = useRef([
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  ]);

  const requestRef = useRef(null);
  const timeRef = useRef(0);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Mouse tracking — desktop only
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      if (containerRef.current) {
        containerRef.current.style.setProperty("--mouse-x", `${(e.clientX / window.innerWidth) * 100}%`);
        containerRef.current.style.setProperty("--mouse-y", `${(e.clientY / window.innerHeight) * 100}%`);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Orb animation — desktop only
  useEffect(() => {
    if (isMobile || !isHome) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const orbs = [orb1Ref, orb2Ref, orb3Ref];
    const sizes = [500, 380, 300];
    const baseOps = [0.25, 0.20, 0.18];
    const orbSpecs = [
      { periodX: 8,  periodY: 9,  rangeX: 0.7, rangeY: 0.6, phase: 0 },
      { periodX: 12, periodY: 10, rangeX: 0.8, rangeY: 0.7, phase: 2 },
      { periodX: 10, periodY: 13, rangeX: 0.75, rangeY: 0.65, phase: 4.5 },
    ];

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      posRefs.current.forEach((pos, i) => {
        const spec = orbSpecs[i];
        const autoX = centerX + Math.sin(t * (2 * Math.PI / spec.periodX) + spec.phase) * (window.innerWidth * spec.rangeX);
        const autoY = centerY + Math.cos(t * (2 * Math.PI / spec.periodY) + spec.phase) * (window.innerHeight * spec.rangeY);

        const dx = cursorRef.current.x - autoX;
        const dy = cursorRef.current.y - autoY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = autoX;
        let targetY = autoY;

        if (dist < 220) {
          const pullBlend = Math.pow(1 - dist / 220, 2);
          targetX = autoX + (cursorRef.current.x - autoX) * pullBlend * 0.6;
          targetY = autoY + (cursorRef.current.y - autoY) * pullBlend * 0.6;
        }

        targetX -= sizes[i] / 2;
        targetY -= sizes[i] / 2;

        pos.x += (targetX - pos.x) * 0.06;
        pos.y += (targetY - pos.y) * 0.06;

        const currentBaseOp = isDark ? baseOps[i] : baseOps[i] * 0.4 + 0.25;
        const pulse = Math.sin(t * 0.4 + spec.phase) * 0.08;

        if (orbs[i].current) {
          orbs[i].current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
          orbs[i].current.style.opacity = Math.max(0, currentBaseOp + pulse).toString();
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isHome, isDark]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-50 overflow-hidden bg-light-bg dark:bg-dark-bg transition-colors duration-700"
    >
      {/* Static blobs — always shown, mobile + desktop */}
      <div className="absolute inset-0 opacity-40 dark:opacity-20 transition-opacity duration-700">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-accent/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[110px]" />
      </div>

      {/* Animated orbs — desktop only */}
      {!isMobile && isHome && (
        <div className="absolute inset-0 pointer-events-none">
          <div ref={orb1Ref} className="absolute top-0 left-0 rounded-full bg-[#EC4899] blur-[80px] will-change-transform" style={{ width: 500, height: 500 }} />
          <div ref={orb2Ref} className="absolute top-0 left-0 rounded-full bg-[#6366F1] blur-[100px] will-change-transform" style={{ width: 380, height: 380 }} />
          <div ref={orb3Ref} className="absolute top-0 left-0 rounded-full bg-[#7C3AED] blur-[90px] will-change-transform" style={{ width: 300, height: 300 }} />
        </div>
      )}

      {/* Mouse radial — desktop only */}
      {!isMobile && (
        <div
          className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-30"
          style={{ background: `radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(168,85,247,0.15), transparent 80%)` }}
        />
      )}

      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay bg-noise" />
    </div>
  );
}
