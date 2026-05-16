import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Discovery",
    description: "Quick WhatsApp chat or call, no forms.",
  },
  {
    number: "02",
    title: "Design & Build",
    description: "Clean code, keeping you updated throughout.",
  },
  {
    number: "03",
    title: "Review & Launch",
    description: "You review, we refine, then go live.",
  },
  {
    number: "04",
    title: "Support",
    description: "Monthly maintenance so nothing ever breaks without a fix.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function Process() {
  return (
    <section id="process" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* ── Heading ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-light-text dark:text-dark-text sm:text-4xl md:text-5xl">
            How It Works
          </h2>
          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-accent" />
        </motion.div>

        {/* ── Steps Row ── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Connector line (desktop only) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-10 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] hidden h-px
              bg-gradient-to-r from-transparent via-accent/25 to-transparent lg:block"
          />

          {STEPS.map(({ number, title, description }) => (
            <motion.div
              key={number}
              variants={fadeUp}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Number circle */}
              <div
                className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full
                  border-2 border-accent/30
                  bg-light-bg dark:bg-dark-bg
                  text-sm font-bold text-accent
                  transition-all duration-300
                  group-hover:border-accent group-hover:bg-accent group-hover:text-white
                  group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                {number}
              </div>

              {/* Card body */}
              <div
                className="w-full rounded-2xl border border-light-text/6 dark:border-dark-text/6
                  bg-white/50 dark:bg-white/[0.02]
                  px-5 py-6 transition-all duration-300
                  group-hover:border-accent/20
                  group-hover:-translate-y-1
                  group-hover:shadow-[0_8px_28px_rgba(0,0,0,0.05)]
                  dark:group-hover:shadow-[0_8px_28px_rgba(0,0,0,0.25)]"
              >
                <h3 className="text-base font-semibold text-light-text dark:text-dark-text">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-light-text/55 dark:text-dark-text/45">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
