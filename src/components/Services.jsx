import { motion } from "framer-motion";

const SERVICES = [
  { id: "01", title: "Custom Websites", outcome: "high-performance digital presence" },
  { id: "02", title: "Booking Systems", outcome: "automated scheduling and client management" },
  { id: "03", title: "Admin Panels", outcome: "centralized data and workflow control" },
  { id: "04", title: "Payment Integration", outcome: "secure and reliable online transactions" },
  { id: "05", title: "WhatsApp Integration", outcome: "direct client communication in one tap" },
  { id: "06", title: "Google Business Profile", outcome: "optimized local search visibility" },
  { id: "07", title: "Data & Backups", outcome: "automated safety for critical records" },
  { id: "08", title: "Monthly Retainer", outcome: "dedicated ongoing technical support" },
];

export default function Services() {
  return (
    <section id="services" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-light-text dark:text-dark-text sm:text-4xl md:text-5xl">
            What I Build
          </h2>
        </motion.div>

        {/* ── List ── */}
        <div className="flex flex-col">
          {SERVICES.map(({ id, title, outcome }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group border-b border-light-text/10 dark:border-dark-text/10 transition-all duration-300 hover:bg-accent/[0.03]"
            >
              <div className="flex flex-col md:flex-row md:items-center py-10 md:py-14 px-4">
                {/* Left: Chevron + Service Name */}
                <div className="flex items-center gap-4 md:w-1/2">
                  <span className="text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6"/></svg>
                  </span>
                  <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-light-text dark:text-dark-text transition-transform duration-300 group-hover:translate-x-2">
                    {title}
                  </h3>
                </div>

                {/* Right: Outcome Description */}
                <div className="mt-4 md:mt-0 md:w-1/2 md:text-right">
                  <p className="text-sm md:text-lg font-light italic tracking-wide text-light-text/50 dark:text-dark-text/40">
                    {outcome}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
