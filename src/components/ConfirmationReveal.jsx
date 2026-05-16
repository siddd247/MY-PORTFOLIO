import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { useEffect } from "react";

export default function ConfirmationReveal({ isOpen, onClose }) {
  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden"
        >
          {/* Liquid Wave SVG Background */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              initial={{ d: "M 100 0 L 100 0 L 100 100 L 100 100 Z" }}
              animate={{ d: "M 100 0 L 0 0 Q 50 50 0 100 L 100 100 Z" }}
              exit={{ d: "M 0 0 L 0 0 L 0 100 L 0 100 Z" }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              fill="currentColor"
              className="text-primary"
            />
          </svg>
          
          {/* High-Design Content Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-secondary opacity-95" />
          
          <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center">
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute -top-24 right-6 md:right-0 p-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={32} strokeWidth={1.5} />
            </button>

            {/* Interactive Typography & Design */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-12"
            >
              {/* Massive Luminescent Check */}
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute inset-0 bg-white/20 blur-3xl rounded-full"
                />
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white text-primary shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                  <Check size={64} strokeWidth={3} />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">
                  COPIED<span className="text-white/30">.</span>
                </h2>
                <p className="mx-auto max-w-xl text-xl md:text-2xl font-medium text-white/80 tracking-tight leading-relaxed">
                  The digital bridge is built. I&rsquo;m ready to automate your manual bottlenecks.
                </p>
              </div>

              {/* Minimalist Action Tip */}
              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="pt-12"
              >
                <button 
                  onClick={onClose}
                  className="px-8 py-3 rounded-full border border-white/20 bg-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-primary transition-all"
                >
                  Return to Portfolio
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
