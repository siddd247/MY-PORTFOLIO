import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";

export const FloatingDockMobile = ({ items }) => {
  const location = useLocation();

  return (
    <motion.div
      style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
      className="flex flex-row items-center justify-around w-full px-4 py-3 rounded-2xl
        bg-white/20 dark:bg-white/5
        border border-white/30 dark:border-white/10
        backdrop-blur-xl"
    >
      {items.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link key={item.title} to={item.href} className="flex-1">
            <motion.div
              whileTap={{ scale: 0.88 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex flex-col items-center justify-center gap-1.5 py-1"
            >
              <div className={`w-11 h-11 flex items-center justify-center rounded-xl
                ${isActive
                  ? "bg-white/30 dark:bg-white/15 border border-white/50 dark:border-white/25"
                  : "bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10"
                }`}
              >
                <div className={`w-5 h-5 ${isActive ? "text-black dark:text-white" : "text-black/50 dark:text-white/50"}`}>
                  {item.icon}
                </div>
              </div>
              <span className={`text-[11px] font-medium tracking-tight ${isActive ? "text-black dark:text-white" : "text-black/50 dark:text-white/50"}`}>
                {item.title}
              </span>
            </motion.div>
          </Link>
        );
      })}
    </motion.div>
  );
};