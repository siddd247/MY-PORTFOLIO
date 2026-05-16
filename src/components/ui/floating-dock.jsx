import { useMotionValue, useSpring, useTransform, motion, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

function IconContainer({ mouseX, title, icon, href, onClick }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-100, 0, 100], [40, 72, 40]);
  const heightTransform = useTransform(distance, [-100, 0, 100], [40, 72, 40]);
  const widthIconTransform = useTransform(distance, [-100, 0, 100], [20, 36, 20]);
  const heightIconTransform = useTransform(distance, [-100, 0, 100], [20, 36, 20]);

  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const widthIcon = useSpring(widthIconTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const heightIcon = useSpring(heightIconTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  return (
    <Link to={href} onClick={onClick}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex items-center justify-center rounded-full backdrop-blur-md bg-white/30 border border-white/40 dark:bg-white/10 dark:border-white/20 shadow-md"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 4, x: "-50%" }}
              className="absolute -top-9 left-1/2 w-fit rounded-md bg-neutral-800 border border-neutral-600 px-2 py-0.5 text-xs whitespace-pre text-white"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div style={{ width: widthIcon, height: heightIcon }} className="flex items-center justify-center">
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}

export const FloatingDockMobile = ({ items, className }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="flex flex-row items-end justify-around w-full gap-3 px-6 py-3 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 dark:bg-white/5 dark:border-white/10 shadow-lg"
    >
      {items.map((item) => (
        <IconContainer
          key={item.title}
          mouseX={mouseX}
          title={item.title}
          icon={item.icon}
          href={item.href}
        />
      ))}
    </motion.div>
  );
};