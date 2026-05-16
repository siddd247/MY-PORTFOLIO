import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { VideoProvider } from "./context/VideoContext";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import GradientBackground from "./components/GradientBackground";
import SmoothScroll from "./components/SmoothScroll";

// Lazy-load pages
const HeroPage    = lazy(() => import("./pages/HeroPage"));
const WorkPage    = lazy(() => import("./pages/WorkPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const AboutPage   = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));

const PageLoader = () => (
  <div className="flex h-screen items-center justify-center text-accent/40 text-sm tracking-widest uppercase">
    Loading…
  </div>
);

// Standard page transition variants
const pageTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -24 },
  transition: { duration: 0.4, ease: "easeOut" }
};

/** Inner component has access to the router context */
function AnimatedRoutes() {
  const location = useLocation();

  // Re-run scroll-reveal observer whenever the route changes
  useEffect(() => {
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => entry.target.classList.add("visible"));
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const raf = requestAnimationFrame(() => {
      document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div {...pageTransition} className="min-h-screen">
              <HeroPage />
            </motion.div>
          } />
          <Route path="/work" element={
            <motion.div {...pageTransition} className="min-h-screen">
              <WorkPage />
            </motion.div>
          } />
          <Route path="/services" element={
            <motion.div {...pageTransition} className="min-h-screen">
              <ServicesPage />
            </motion.div>
          } />
          <Route path="/about" element={
            <motion.div {...pageTransition} className="min-h-screen">
              <AboutPage />
            </motion.div>
          } />
          <Route path="/contact" element={
            <motion.div {...pageTransition} className="min-h-screen">
              <ContactPage />
            </motion.div>
          } />
          <Route path="/project/:id" element={
            <motion.div {...pageTransition} className="min-h-screen">
              <ProjectDetailPage />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <VideoProvider>
        <SmoothScroll>
          <GradientBackground />
          <div className="min-h-screen">
          <Navbar />
          <main className="relative z-10">
            <AnimatedRoutes />
          </main>
        </div>
        </SmoothScroll>
      </VideoProvider>
    </BrowserRouter>
  );
}
