import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

import { Link } from "react-router-dom";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { PROJECTS } from "../data/projects";

const SPRING = { type: "spring", stiffness: 140, damping: 22, mass: 0.8 };

export default function Projects() {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState({});
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const next = () => setIndex((p) => (p + 1) % PROJECTS.length);
  const prev = () => setIndex((p) => (p - 1 + PROJECTS.length) % PROJECTS.length);

  const onDragEnd = (_, info) => {
    if (info.offset.x < -80) next();
    else if (info.offset.x > 80) prev();
  };

  return (
    <div ref={containerRef} style={{ overflow: "hidden", position: "relative" }}>
      {/* ── Parallax Background Element ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-1/4 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none"
      />

      <section
        id="projects"
        className="relative flex flex-col items-center w-full px-4 pt-[100px] md:pt-[100px] pb-[40px]"
      >
        {/* Heading — hidden */}
        <h2 className="hidden text-4xl md:text-5xl font-bold tracking-tight text-light-text dark:text-dark-text mb-2 text-center">
          Archive
        </h2>
        <div className="hidden mx-auto mb-8 h-1.5 w-12 rounded-full bg-accent" />

        {/* Carousel wrapper */}
        <div className="relative w-full flex justify-center items-center md:mt-5">
          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-2 md:left-8 z-30 p-2 rounded-full border border-white/10 bg-black/20 hover:bg-white/10 transition-colors hidden md:flex"
          >
            <ChevronLeft size={22} className="text-light-text dark:text-dark-text" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 md:right-8 z-30 p-2 rounded-full border border-white/10 bg-black/20 hover:bg-white/10 transition-colors hidden md:flex"
          >
            <ChevronRight size={22} className="text-light-text dark:text-dark-text" />
          </button>

          {/* Track */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={onDragEnd}
            style={{ touchAction: "none", willChange: "transform", position: "relative" }}
            className="relative w-full max-w-[340px] md:max-w-[700px] cursor-grab active:cursor-grabbing"
          >
            {/* Card height: tall on mobile for portrait preview */}
            <div className="relative w-full h-[520px] md:h-[420px]">
              {PROJECTS.map((project, i) => {
                let diff = (i - index + PROJECTS.length) % PROJECTS.length;
                if (diff > PROJECTS.length / 2) diff -= PROJECTS.length;
                const isCenter = diff === 0;
                const isVisible = Math.abs(diff) <= 1;
                if (!isVisible) return null;

                return (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{
                      opacity: isCenter ? 1 : 0.35,
                      scale: isCenter ? 1 : 0.85,
                      x: `${diff * 80}%`,
                      y: 0,
                      zIndex: isCenter ? 20 : 10,
                    }}
                    transition={{
                      ...SPRING,
                      y: { delay: i * 0.1, duration: 0.8, ease: "easeOut" }
                    }}
                    className="absolute inset-0 flex flex-col"
                    style={{ pointerEvents: "none" }}
                  >
                    {/* Browser frame */}
                    <div className="w-full h-full rounded-2xl overflow-hidden border border-light-text/10 dark:border-dark-text/10 shadow-2xl bg-[#080808] flex flex-col">
                      {/* Top bar */}
                      <div className="flex-shrink-0 bg-[#1a1a1a] border-b border-white/5 px-4 py-2.5 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                        </div>
                        <div className="mx-auto bg-black/40 rounded-md px-3 py-0.5 text-[10px] font-mono text-white/30 truncate max-w-[140px]">
                          {project.url.replace("https://", "")}
                        </div>
                      </div>

                      {/* Iframe area */}
                      <div className="relative flex-1 overflow-hidden bg-white/5">
                        {!loaded[i] && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
                          </div>
                        )}
                        <iframe
                          src={project.url}
                          onLoad={() => setLoaded((p) => ({ ...p, [i]: true }))}
                          title={project.title}
                          loading="lazy"
                          sandbox="allow-scripts allow-same-origin"
                          style={{
                            pointerEvents: "none",
                            width: "200%",
                            height: "200%",
                            border: "none",
                            transformOrigin: "top left",
                            transform: "scale(0.5)",
                            opacity: loaded[i] ? 1 : 0,
                            transition: "opacity 0.4s ease",
                          }}
                        />
                        <div className="absolute inset-0 z-10" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Info below carousel */}
        <div className="mt-5 text-center">
          <h3 className="w-full text-center text-lg md:text-2xl font-bold text-light-text dark:text-dark-text">
            {PROJECTS[index].title}
          </h3>
          <p className="text-xs md:text-sm text-light-text/50 dark:text-dark-text/40 mt-1">
            {PROJECTS[index].subtitle}
          </p>
        </div>

        {/* iOS-style pagination */}
        <div className="flex gap-[6px] mt-5 items-center justify-center">
          {PROJECTS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setIndex(i)}
              className="rounded-full"
              animate={{
                width: i === index ? 20 : 6,
                height: 6,
                backgroundColor: i === index ? "#A855F7" : "rgba(168,85,247,0.25)",
                scale: i === index ? 1 : 1,
              }}
              transition={{
                width: { type: "spring", stiffness: 200, damping: 25 },
                backgroundColor: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
              }}
              style={{ originX: 0.5 }}
            />
          ))}
        </div>

        {/* Open Project button */}
        <HoverBorderGradient
          as={Link}
          to={`/project/${PROJECTS[index].id}`}
          containerClassName="mt-6 rounded-full shadow-[0_0_24px_rgba(168,85,247,0.24)] dark:shadow-none dark:border-zinc-800 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] dark:hover:shadow-[0_0_36px_rgba(168,85,247,0.36)]"
          className="flex items-center gap-2 px-7 py-3 bg-white/75 hover:bg-white dark:bg-black dark:hover:bg-white text-black dark:text-white text-sm font-medium transition-colors"
        >
          <span>Open Project</span>
          <ExternalLink size={15} />
        </HoverBorderGradient>
      </section>
    </div>
  );
}