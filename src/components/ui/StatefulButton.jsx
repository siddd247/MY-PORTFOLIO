import { cn } from "../../lib/utils";
import React from "react";
import { motion, useAnimate } from "framer-motion";

export const StatefulButton = ({ className, children, onClick, ...props }) => {
  const [scope, animate] = useAnimate();

  const animateLoading = async () => {
    await animate(".loader", { width: "20px", scale: 1, display: "block" }, { duration: 0.2 });
  };

  const animateSuccess = async () => {
    await animate(".loader", { width: "0px", scale: 0, display: "none" }, { duration: 0.2 });
    await animate(".check", { width: "20px", scale: 1, display: "block" }, { duration: 0.2 });
    await animate(".check", { width: "0px", scale: 0, display: "none" }, { delay: 2, duration: 0.2 });
  };

  const handleClick = async (event) => {
    await animateLoading();
    // Wrap onClick in a promise if it isn't one
    if (onClick) {
      await Promise.resolve(onClick(event));
    }
    await animateSuccess();
  };

  return (
    <motion.button
      layout
      ref={scope}
      className={cn(
        "flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 font-medium text-white transition duration-200 hover:ring-2 hover:ring-offset-2",
        className
      )}
      style={{
        background: "linear-gradient(135deg, #A855F7, #7C3AED)",
        "--tw-ring-color": "#A855F7",
        "--tw-ring-offset-color": "transparent",
      }}
      onClick={handleClick}
      {...props}
    >
      <motion.div layout className="flex items-center gap-2">
        <motion.svg
          animate={{ rotate: [0, 360] }}
          initial={{ scale: 0, width: 0, display: "none" }}
          style={{ scale: 0.5, display: "none" }}
          transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="loader text-white"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 3a9 9 0 1 0 9 9" />
        </motion.svg>

        <motion.svg
          initial={{ scale: 0, width: 0, display: "none" }}
          style={{ scale: 0.5, display: "none" }}
          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="check text-white"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M9 12l2 2l4 -4" />
        </motion.svg>

        <motion.span layout>{children}</motion.span>
      </motion.div>
    </motion.button>
  );
};
