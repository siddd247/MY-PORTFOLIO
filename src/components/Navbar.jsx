import { useState, useEffect } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useVideo } from "../context/VideoContext";
import { ChevronDown, X } from "lucide-react";
import { FloatingDockMobile } from "./ui/floating-dock";
import { IconTerminal2, IconNewSection, IconExchange } from "@tabler/icons-react";

const NAV_LINKS = [
  { label: "Archive", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { videoPlaying, setVideoPlaying } = useVideo();
  const isDarkMode = theme === "dark";
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showDock, setShowDock] = useState(false);
  const [visuallyExpanded, setVisuallyExpanded] = useState(location.pathname === "/" && window.scrollY < 40);

  const mobileNavLinks = [
    { title: "Work", icon: <IconTerminal2 className="h-full w-full text-black dark:text-white" />, href: "/work" },
    { title: "Services", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full text-black dark:text-white icon icon-tabler icons-tabler-outline icon-tabler-folder"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" /></svg>, href: "/services" },
    { title: "About", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full text-black dark:text-white lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, href: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY < 40;
      const isHome = location.pathname === "/";

      if (!isHome) {
        setScrolled(true);
      } else {
        setScrolled(!isTop);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Close dock on route change
  useEffect(() => {
    setShowDock(false);
    setVideoPlaying(false);
  }, [location.pathname, setVideoPlaying]);

  const isHome = location.pathname === "/";
  const isExpanded = isHome && !scrolled;

  useEffect(() => {
    const timer = setTimeout(() => setVisuallyExpanded(isExpanded), isExpanded ? 0 : 10);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  return (
    <>
      <LayoutGroup>
        {/* Pill container — always rendered, positions itself */}
        <motion.div
          layout
          layoutId="navbar-pill"
          style={{
            backdropFilter: visuallyExpanded ? "none" : "blur(20px) saturate(200%)",
            WebkitBackdropFilter: visuallyExpanded ? "none" : "blur(20px) saturate(200%)",
            background: visuallyExpanded ? "transparent" : "rgba(255,255,255,0.06)",
            border: visuallyExpanded ? "1px solid transparent" : "1px solid rgba(255,255,255,0.12)",
            boxShadow: visuallyExpanded ? "none" : "0 2px 32px rgba(0,0,0,0.08)",
            willChange: "transform",
            transition: "background 0.5s ease, border 0.5s ease, backdrop-filter 0.5s ease",
          }}
          className={`fixed z-50 top-6 transition-colors duration-500
            ${isExpanded
              ? "left-4 right-4 rounded-none bg-transparent flex items-center justify-between"
              : "left-0 right-0 mx-auto w-[92%] md:w-max max-w-4xl rounded-full flex items-center justify-between md:justify-center gap-2 md:gap-8 px-3 py-2.5 md:px-8 md:py-3.5"
            }`}
          transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.4 }}
        >
          {/* Wordmark — slides from left to center-left */}
          <motion.div layout layoutId="navbar-wordmark">
            <Link
              to="/"
              className={`font-normal tracking-[-0.02em] text-lg md:text-xl whitespace-nowrap transition-colors duration-700 ${videoPlaying && isDarkMode ? "text-black" : "text-light-text dark:text-dark-text"}`}
            >
              Sidhaya Katoch
            </Link>
          </motion.div>

          {/* Mobile Menu Trigger - Between name and CTA */}
          <button
            onClick={() => setShowDock(!showDock)}
            className="flex md:hidden items-center justify-center p-2 rounded-full glass hover:text-accent transition-colors"
          >
            <motion.div
              animate={{ rotate: showDock ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {showDock ? <X size={20} /> : <ChevronDown size={20} />}
            </motion.div>
          </button>

          {/* Nav links — visible on desktop, centered when expanded */}
          <motion.ul
            layout
            layoutId="navbar-links"
            className={`items-center gap-8
              ${isExpanded
                ? "hidden md:flex absolute left-1/2 -translate-x-1/2"
                : "hidden md:flex"
              }`}
          >
            {NAV_LINKS.map(({ label, to }) => (
              <motion.li
                key={to}
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `inline-block font-medium text-base tracking-wide transition-colors duration-700 hover:text-accent
                    ${videoPlaying && isDarkMode ? "text-black" : isActive ? "text-accent" : "text-light-text/70 dark:text-dark-text/70"}`
                  }
                >
                  {label}
                </NavLink>
              </motion.li>
            ))}
          </motion.ul>

          {/* Right buttons — slides from right to center-right */}
          <motion.div layout layoutId="navbar-buttons" className="flex items-center gap-2 md:gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 rounded-full purple-gradient-border font-semibold text-light-text dark:text-dark-text transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-[1.03] active:scale-[0.97] px-3 py-1.5 md:px-6 md:py-2.5 text-xs md:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 md:w-4 md:h-4"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              <span className="hidden sm:inline">Let&rsquo;s Talk</span>
              <span className="sm:hidden">Talk</span>
            </Link>
            <button
              onClick={toggleTheme}
              role="switch"
              aria-checked={isDarkMode}
              aria-label="Toggle Dark Mode"
              className="relative flex items-center justify-between px-1.5 md:px-2 rounded-full focus:outline-none glass cursor-pointer transition-all duration-300 h-8 w-14 md:h-9 md:w-[72px]"
            >
              <svg className="h-3 w-3 md:h-4 md:w-4 text-gray-500 z-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg className="h-2.5 md:h-3.5 w-2.5 md:w-3.5 text-gray-500 z-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span className={`absolute left-0.5 md:left-1 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out z-10 shadow-[0_2px_4px_rgba(0,0,0,0.2)] ${isDarkMode ? "bg-white" : "bg-black"} h-5 w-5 md:h-7 md:w-7 ${isDarkMode ? "translate-x-7 md:translate-x-8" : "translate-x-0"}`} />
            </button>
          </motion.div>
        </motion.div>
      </LayoutGroup>

      {/* Floating Navigation Dock (Mobile Only) */}
      <motion.div
        animate={{ opacity: showDock ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ pointerEvents: showDock ? "auto" : "none", transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
        className={`fixed left-0 right-0 mx-auto w-[88%] z-40 md:hidden ${isHome ? "bottom-[72px]" : "bottom-8"}`}
      >
        <div className="flex justify-center w-full">
          <FloatingDockMobile items={mobileNavLinks} />
        </div>
      </motion.div>
    </>
  );
}