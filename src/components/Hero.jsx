import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useCallback, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useVideo } from "../context/VideoContext";
import { useTheme } from "../hooks/useTheme";
import { LinkPreview } from "./ui/link-preview";

const EMAIL = "sidhaya.work@gmail.com";

// ── Squiggle colours & config ──────────────────────────────────────────────
const SQUIGGLE_COLORS = ["#a855f7", "#ec4899", "#818cf8", "#c084fc"];
const NUM_SQUIGGLES = 14;
const RADIUS = 72; // px distance from text centre

function lerp(a, b, t) { return a + (b - a) * t; }

// Build stable per-squiggle config once (outside component to avoid re-runs)
const SQUIGGLE_DEFS = Array.from({ length: NUM_SQUIGGLES }, (_, i) => ({
  angle: (i / NUM_SQUIGGLES) * Math.PI * 2,
  color: SQUIGGLE_COLORS[i % SQUIGGLE_COLORS.length],
  len: 28 + Math.random() * 28,        // 28-56 px
  phase: Math.random() * Math.PI * 2,  // unique vibration phase
  speed: 0.8 + Math.random() * 1.2,    // individual vibration speed
}));

function SquiggleName({ children }) {
  const [hovered, setHovered] = useState(false);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const scaleRef = useRef(0); // 0 = hidden, 1 = fully visible

  useEffect(() => {
    const svgEl = canvasRef.current;
    if (!svgEl) return;

    let t = 0;
    const target = () => (hovered ? 1 : 0);

    function frame() {
      t += 0.016;
      // lerp towards target
      scaleRef.current = lerp(scaleRef.current, target(), 0.12);
      const s = scaleRef.current;

      // clear previous paths
      while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

      if (s < 0.005) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      SQUIGGLE_DEFS.forEach((def) => {
        const vibrate = Math.sin(t * def.speed * 3 + def.phase) * 4 * s;
        const actualAngle = def.angle + vibrate * 0.04;
        const r = RADIUS + vibrate;
        const cx = Math.cos(actualAngle) * r;
        const cy = Math.sin(actualAngle) * r;

        // direction vector along the radius
        const dx = Math.cos(actualAngle);
        const dy = Math.sin(actualAngle);
        // perpendicular
        const px = -dy;
        const py = dx;

        const half = (def.len * s) / 2;
        const amp = 5 * s;
        const freq = 0.25;

        // Build a wavy path from -half to +half along the radius
        const steps = 12;
        const pts = [];
        for (let k = 0; k <= steps; k++) {
          const frac = k / steps;
          const along = (frac - 0.5) * def.len * s;
          const wave = Math.sin(frac * Math.PI * 4 + t * def.speed * 4 + def.phase) * amp;
          pts.push([
            cx + dx * along + px * wave,
            cy + dy * along + py * wave,
          ]);
        }

        const d = pts
          .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
          .join(" ");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("stroke", def.color);
        path.setAttribute("stroke-width", (2 * s).toFixed(2));
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("fill", "none");
        path.setAttribute("opacity", s.toFixed(3));
        svgEl.appendChild(path);
      });

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovered]);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
    >
      {children}
      <svg
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "visible",
          width: 0,
          height: 0,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
    </span>
  );
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero({ onTrigger }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [videoEnding, setVideoEnding] = useState(false);
  const navigate = useNavigate();
  
  const { setVideoPlaying } = useVideo();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const isMobile = window.matchMedia("(hover: none)").matches;

  useEffect(() => {
    if (showCopied) {
      const t = setTimeout(() => setShowCopied(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showCopied]);

  const handleGetInTouch = () => {
    navigator.clipboard.writeText(EMAIL);
    if (onTrigger) onTrigger();
    if (isMobile) {
      setShowCopied(true);
    } else {
      setVideoPlaying(true);
      setShowVideo(true);
    }
  };

  // Mouse parallax setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 80, damping: 20 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const bgX = useTransform(springX, [-0.5, 0.5], [20, -20]);
  const bgY = useTransform(springY, [-0.5, 0.5], [15, -15]);

  const handleMouseMove = (e) => {
    if (isLeaving) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX / width) - 0.5;
    const y = (clientY / height) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleAction = useCallback(() => {
    navigator.clipboard.writeText(EMAIL);
    if (onTrigger) onTrigger();
  }, [onTrigger]);

  const handlePreviewClick = () => {
    setIsLeaving(true);
  };

  return (
    <motion.section
      id="hero"
      onMouseMove={handleMouseMove}
      animate={isLeaving ? { opacity: 0, y: -60, scale: 0.96 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (isLeaving) navigate("/work");
      }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-3 pt-24 md:pt-32"
    >
      {/* ── Radial accent glow (Parallax) ── */}
      <motion.div
        aria-hidden="true"
        style={{ x: bgX, y: bgY }}
        animate={isLeaving ? { scale: 1.4, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          h-[600px] w-[600px] rounded-full
          bg-accent/8 dark:bg-accent/10
          blur-[120px]"
      />

      {/* ── Content ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full md:w-[80%] text-center md:text-left"
      >
        <motion.h1
          variants={fadeUp}
          className="text-[1.8rem] md:text-4xl lg:text-4xl font-normal leading-[1.3] text-light-text/90 dark:text-dark-text/90"
        >
          Hello, world! I&rsquo;m{" "}
          <span
            onTouchStart={(e) => { e.preventDefault(); setMobilePreviewOpen((p) => !p); }}
            className="cursor-pointer"
          >
            <span onClick={() => navigate("/")} className="cursor-pointer">
              <LinkPreview
                isStatic
                imageSrc="/previews/sid.jpg"
                url="https://github.com/siddd247"
                forceOpen={mobilePreviewOpen}
                className="font-medium text-light-text dark:text-dark-text"
              >
                <SquiggleName>Sidhaya Katoch</SquiggleName>
              </LinkPreview>
            </span>
          </span>.
          I build high-performance websites that automate your business workflows.
          I&rsquo;m here to turn your manual bottlenecks into streamlined digital systems.
        </motion.h1>

        {/* ── Minimalist CTA ── */}
        <motion.div variants={fadeUp} className="mt-12 flex justify-center md:justify-start">
          <button
            onClick={handleGetInTouch}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className="group relative flex items-center gap-4 pb-1.5 text-lg cursor-pointer"
          >
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1 text-purple-accent">&rarr;</span>
            <span className="text-light-text dark:text-dark-text font-medium min-w-[120px] text-left overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={isHovered ? "copy" : "touch"}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {isHovered ? "Copy Mail?" : "Get in touch"}
                </motion.span>
              </AnimatePresence>
            </span>
            {/* Moving Gradient Underline */}
            <span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-gradient-to-r from-purple-accent via-indigo-400 to-purple-accent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>
      </motion.div>

      {/* ── Scroll Hint (Tap to preview) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        onClick={handlePreviewClick}
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex items-center gap-3.5 pb-1 group cursor-pointer select-none"
      >
        <span className="text-purple-accent transition-transform duration-300 group-hover:translate-y-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
            <path d="M8 18L12 22L16 18" />
            <path d="M12 2V22" />
          </svg>
        </span>
        <span className="text-[17px] font-medium text-light-text/50 dark:text-dark-text/40 group-hover:text-light-text dark:group-hover:text-dark-text transition-colors">
          Tap to preview
        </span>
        <span className="absolute bottom-0 right-0 h-[1px] w-0 bg-purple-accent/40 transition-all duration-500 group-hover:w-full" />
      </motion.div>

      <AnimatePresence>
        {/* Desktop only */}
        {showVideo && !isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ backgroundColor: "transparent", pointerEvents: "none" }}
            className="fixed inset-0 z-[40]"
          >
            <motion.div
              animate={videoEnding ? {
                opacity: 0,
                scale: 1.08,
                y: -40,
                filter: "blur(12px)",
                backgroundColor: isDarkMode ? "#080808" : "#F5F5F7",
              } : {
                opacity: 1,
                scale: 1,
                y: 0,
                filter: "blur(0px)",
                backgroundColor: "rgba(0,0,0,0)",
              }}
              transition={{
                duration: 1.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="fixed inset-0 z-[40]"
              style={{ pointerEvents: "none" }}
            >
              <video
                src="https://www.image2url.com/r2/default/videos/1778884851848-fa54dd20-10c3-4a65-9f56-0516522760a0.mp4"
                autoPlay
                loop={false}
                muted
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                controlsList="nodownload nofullscreen noremoteplayback"
                className="w-full md:w-full md:h-full md:object-cover object-contain"
                onEnded={() => {
                  setVideoEnding(true);
                  setVideoPlaying(false);
                  setTimeout(() => {
                    setShowVideo(false);
                    setVideoEnding(false);
                  }, 1800);
                }}
              />
            </motion.div>


          </motion.div>
        )}

        {/* Mobile only */}
        {showCopied && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={`fixed inset-0 z-[999] flex items-center justify-center overflow-hidden ${isDarkMode ? "bg-[#080808]" : "bg-white"}`}
            style={{ pointerEvents: "none" }}
          >
            {/* Parallax glow orb */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[500px] h-[500px] rounded-full bg-accent/20 blur-[120px]"
            />

            {/* Letters */}
            <div className="relative z-10 flex items-end gap-2 md:gap-4" style={{ fontFamily: "'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
              {["C","O","P","I","E","D","!"].map((letter, i) => (
                <motion.span
                  key={letter + i}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`text-[18vw] md:text-[14vw] font-black leading-none tracking-tight ${isDarkMode ? "text-white" : "text-black"}`}
                  style={{ display: "inline-block", transformOrigin: "bottom center", perspectiveOrigin: "bottom" }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Accent underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-[28%] w-[80vw] md:w-[60vw] h-[3px] bg-accent origin-left"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute bottom-[18%] text-sm md:text-base tracking-widest uppercase ${isDarkMode ? "text-white/40" : "text-black/40"}`}
            >
              sidhaya.work@gmail.com
            </motion.p>



          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
