import { motion } from "framer-motion";
import Services from "../components/Services";
import Footer from "../components/Footer";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

export default function ServicesPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Services />
      <Footer />
    </motion.div>
  );
}
