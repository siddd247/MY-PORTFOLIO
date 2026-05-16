import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function GradientBackground() {
  const containerRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);
  
  const cursorRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const posRefs = useRef([
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  ]);

  const orbStates = useRef([
    { splashing: false, splashStartTime: 0, lastSplashTime: 0 },
    { splashing: false, splashStartTime: 0, lastSplashTime: 0 },
    { splashing: false, splashStartTime: 0, lastSplashTime: 0 }
  ]);

  const [droplets, setDroplets] = useState([]);
  
  const requestRef = useRef(null);
  const timeRef = useRef(0);
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Check for dark mode
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

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      
      if (containerRef.current) {
        const xPerc = (e.clientX / window.innerWidth) * 100;
        const yPerc = (e.clientY / window.innerHeight) * 100;
        containerRef.current.style.setProperty("--mouse-x", `${xPerc}%`);
        containerRef.current.style.setProperty("--mouse-y", `${yPerc}%`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const triggerSplash = (i, centerX, centerY) => {
    const now = performance.now();
    const state = orbStates.current[i];
    if (now - state.lastSplashTime < 900) return;

    state.splashing = true;
    state.splashStartTime = now;
    state.lastSplashTime = now;

    const palettes = [
      ["#EC4899", "#F472B6"], // Pink Palette for Orb 1
      ["#6366F1", "#818CF8"],
      ["#7C3AED", "#A78BFA"]
    ];

    const newDroplets = [];
    for (let j = 0; j < 6; j++) {
      const angle = (j * 60) + (Math.random() * 40 - 20);
      const rad = angle * (Math.PI / 180);
      const dist = 80 + Math.random() * 80;
      const size = 40 + Math.random() * 60;
      
      newDroplets.push({
        id: Math.random().toString(36).substr(2, 9),
        startX: centerX,
        startY: centerY,
        endX: centerX + Math.cos(rad) * dist,
        endY: centerY + Math.sin(rad) * dist,
        size,
        blur: 20 + Math.random() * 20,
        color: palettes[i][j % 2],
      });
    }

    setDroplets(prev => [...prev, ...newDroplets]);

    setTimeout(() => {
      setDroplets(prev => prev.filter(d => !newDroplets.find(nd => nd.id === d.id)));
    }, 600);
  };

  // Orb Animation Loop
  useEffect(() => {
    if (!isHome) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const orbs = [orb1Ref, orb2Ref, orb3Ref];
    const sizes = [500, 380, 300];
    const baseOps = [0.25, 0.20, 0.18];
    const orbSpecs = [
      { periodX: 8, periodY: 9, rangeX: 0.7, rangeY: 0.6, phase: 0 },
      { periodX: 12, periodY: 10, rangeX: 0.8, rangeY: 0.7, phase: 2 },
      { periodX: 10, periodY: 13, rangeX: 0.75, rangeY: 0.65, phase: 4.5 }
    ];

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const now = performance.now();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      posRefs.current.forEach((pos, i) => {
        const spec = orbSpecs[i];
        const state = orbStates.current[i];
        
        const autoX = centerX + Math.sin(t * (2 * Math.PI / spec.periodX) + spec.phase) * (window.innerWidth * spec.rangeX);
        const autoY = centerY + Math.cos(t * (2 * Math.PI / spec.periodY) + spec.phase) * (window.innerHeight * spec.rangeY);

        const dx = cursorRef.current.x - autoX;
        const dy = cursorRef.current.y - autoY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let targetX = autoX;
        let targetY = autoY;
        let pullBlend = 0;

        if (dist < 220) {
          pullBlend = Math.pow(1 - dist / 220, 2);
          targetX = autoX + (cursorRef.current.x - autoX) * pullBlend * 0.6;
          targetY = autoY + (cursorRef.current.y - autoY) * pullBlend * 0.6;
          triggerSplash(i, autoX, autoY);
        }

        targetX -= sizes[i] / 2;
        targetY -= sizes[i] / 2;

        pos.x += (targetX - pos.x) * 0.06;
        pos.y += (targetY - pos.y) * 0.06;

        let scale = 1;
        let splashOpacityBoost = 0;
        
        if (state.splashing) {
          const elapsed = now - state.splashStartTime;
          if (elapsed < 150) {
            scale = 1 + (elapsed / 150) * 0.2;
            splashOpacityBoost = (elapsed / 150) * 0.2;
          } else if (elapsed < 400) {
            const easeProgress = (elapsed - 150) / 250;
            scale = 1.2 - easeProgress * 0.2;
            splashOpacityBoost = 0.2 * (1 - easeProgress);
          } else {
            state.splashing = false;
          }
        }

        const currentBaseOp = isDark ? baseOps[i] : (baseOps[i] * 0.4) + 0.25;
        const pulse = Math.sin(t * 0.4 + spec.phase) * 0.08;
        const finalOpacity = currentBaseOp + pulse + (pullBlend * 0.15) + splashOpacityBoost;

        if (orbs[i].current) {
          orbs[i].current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${scale})`;
          orbs[i].current.style.opacity = Math.max(0, finalOpacity).toString();
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isHome, isDark]);

  // Desktop Light Mode visibility ring
  const ringStyle = (!isDark && window.innerWidth >= 768) 
    ? { boxShadow: 'inset 0 0 0 1px rgba(168, 85, 247, 0.12)' } 
    : {};

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-50 overflow-hidden bg-light-bg dark:bg-dark-bg transition-colors duration-700"
    >
      <div className="absolute inset-0 opacity-40 dark:opacity-20 transition-opacity duration-700">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-accent/30 blur-[120px] animate-[blob_7s_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[100px] animate-[blob_7s_infinite] animation-delay-2000" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[110px] animate-[blob_7s_infinite] animation-delay-4000" />
      </div>

      {/* Dispersion Droplets */}
      {isHome && droplets.map(d => (
        <div 
          key={d.id}
          className="absolute rounded-full pointer-events-none animate-droplet"
          style={{
            left: 0, top: 0,
            width: `${d.size}px`, height: `${d.size}px`,
            backgroundColor: d.color,
            filter: `blur(${d.blur}px)`,
            "--start-x": `${d.startX - d.size / 2}px`,
            "--start-y": `${d.startY - d.size / 2}px`,
            "--end-x": `${d.endX - d.size / 2}px`,
            "--end-y": `${d.endY - d.size / 2}px`,
            transform: `translate3d(var(--start-x), var(--start-y), 0)`,
            opacity: 0.6,
            transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease-out'
          }}
          ref={el => {
            if (el) {
              requestAnimationFrame(() => {
                el.style.transform = `translate3d(var(--end-x), var(--end-y), 0)`;
                el.style.opacity = '0';
              });
            }
          }}
        />
      ))}

      {isHome && (
        <div className="absolute inset-0 pointer-events-none">
          <div ref={orb1Ref} className="absolute top-0 left-0 rounded-full bg-[#EC4899] blur-[80px] will-change-transform" style={{ width: '500px', height: '500px', zIndex: 1, ...ringStyle }} />
          <div ref={orb2Ref} className="absolute top-0 left-0 rounded-full bg-[#6366F1] blur-[100px] will-change-transform" style={{ width: '380px', height: '380px', zIndex: 2, ...ringStyle }} />
          <div ref={orb3Ref} className="absolute top-0 left-0 rounded-full bg-[#7C3AED] blur-[90px] will-change-transform" style={{ width: '300px', height: '300px', zIndex: 3, ...ringStyle }} />
        </div>
      )}

      <div 
        className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-30"
        style={{
          background: `radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(168, 85, 247, 0.15), transparent 80%)`
        }}
      />
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay bg-noise" />
    </div>
  );
}
