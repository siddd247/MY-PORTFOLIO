import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, Store, Zap } from "lucide-react";

const PILLS = [
  { icon: Code2, text: "Custom built, no templates", color: "text-primary", bg: "bg-primary/10", hover: "group-hover:bg-primary" },
  { icon: Store, text: "Local business specialist", color: "text-secondary", bg: "bg-secondary/10", hover: "group-hover:bg-secondary" },
  { icon: Zap, text: "Reply within a few hours", color: "text-tertiary", bg: "bg-tertiary/10", hover: "group-hover:bg-tertiary" },
];

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section ref={containerRef} id="about" className="relative px-6 py-24 md:py-32 overflow-hidden">
      {/* ── Parallax Background Element ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-1/3 left-0 w-72 h-72 bg-accent/5 rounded-full blur-[110px] pointer-events-none"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-light-text dark:text-dark-text sm:text-4xl md:text-5xl">
            Who&rsquo;s Behind This
          </h2>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
          {/* ── Left: Bio ── */}
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-base leading-[1.85] text-light-text/70 dark:text-dark-text/60 md:text-lg md:leading-[1.9]"
            >
              I&rsquo;m{" "}
              <span className="font-semibold text-light-text dark:text-dark-text">
                Sidhaya Katoch
              </span>{" "}
              — a computer science student and freelance developer who builds
              real products for real businesses. I specialise in websites,
              booking systems, and WhatsApp automation that actually solve
              problems instead of just looking good.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-base leading-[1.85] text-light-text/70 dark:text-dark-text/60 md:text-lg md:leading-[1.9]"
            >
              Every project is custom built — no drag-and-drop builders, no
              bloated templates. Just clean code, thoughtful design, and systems
              that work.
            </motion.p>
          </div>

          {/* ── Right: Punchy Pills ── */}
          <div className="flex flex-col gap-4">
            {PILLS.map(({ icon: Icon, text, color, bg, hover }, index) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 + (index * 0.12), ease: [0.22, 1, 0.36, 1] }}
                className="group flex items-center gap-4 rounded-full border
                  border-light-text/6 dark:border-dark-text/6
                  bg-white/70 dark:bg-white/[0.03]
                  px-6 py-4 transition-all duration-300
                  hover:border-accent/30 hover:-translate-y-0.5
                  hover:shadow-[0_6px_24px_rgba(0,0,0,0.05)]
                  dark:hover:shadow-[0_6px_24px_rgba(0,0,0,0.25)]"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                    ${bg} ${color} transition-all duration-300
                    ${hover} group-hover:text-white`}
                >
                  <Icon size={16} strokeWidth={2} />
                </div>
                <span className="text-sm font-semibold text-light-text dark:text-dark-text">
                  {text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
