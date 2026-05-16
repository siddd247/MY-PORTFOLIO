import { motion } from "framer-motion";
import Hero from "../components/Hero";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-screen overflow-hidden"
    >
      <Hero />
    </motion.div>
  );
}
