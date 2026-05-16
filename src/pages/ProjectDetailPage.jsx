import { motion } from "framer-motion";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PROJECTS } from "../data/projects";
import { useState } from "react";
import { HoverBorderGradient } from "../components/ui/hover-border-gradient";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = PROJECTS.find((p) => p.id === id);
  const [loadedDesktop, setLoadedDesktop] = useState(false);
  const [loadedMobile, setLoadedMobile] = useState(false);

  if (!project) return <Navigate to="/work" replace />;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-32 pb-24 px-6 md:px-12 flex flex-col max-w-7xl mx-auto"
    >
      {/* ── Header ── */}
      <div className="flex flex-col items-start gap-8 mb-16 w-full">
        <Link 
          to="/work" 
          className="inline-flex items-center gap-2 text-sm font-medium text-light-text/60 dark:text-dark-text/60 hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
        
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-light-text/10 dark:border-dark-text/10 pb-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-light-text dark:text-dark-text mb-4">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-light-text/70 dark:text-dark-text/70 leading-relaxed">
              {project.problem}
            </p>
          </div>
          
          <HoverBorderGradient
            as="a"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            containerClassName="shrink-0 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.3)] dark:shadow-none transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_0_36px_rgba(168,85,247,0.36)]"
            className="flex items-center gap-2 px-6 py-3 bg-white/75 hover:bg-white dark:bg-black text-black dark:text-white text-sm font-bold transition-colors"
          >
            <span>Open Live Site</span>
            <ExternalLink size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </HoverBorderGradient>
        </div>
      </div>

      {/* ── Mockups ── */}
      <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-16 xl:gap-8 w-full mt-4">
        
        {/* Laptop Mockup */}
        <div className="relative w-full max-w-[800px] aspect-[16/10] shrink-0 xl:w-[65%]">
          {/* Base */}
          <div className="absolute inset-0 rounded-[1.5rem] md:rounded-[2rem] border-4 md:border-8 border-[#1a1a1a] dark:border-[#2a2a2a] bg-[#0a0a0a] shadow-2xl overflow-hidden p-2 md:p-4 pb-0">
            {/* Screen */}
            <div className="relative w-full h-full rounded-t-lg md:rounded-t-xl bg-[#111] overflow-hidden border border-white/5">
               {/* Browser bar */}
              <div className="absolute top-0 inset-x-0 h-6 md:h-8 bg-[#1a1a1a] border-b border-white/5 px-3 flex items-center gap-1.5 z-20">
                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                <div className="w-2 h-2 rounded-full bg-green-500/40" />
                <div className="mx-auto bg-black/40 rounded px-2 md:px-4 py-[1px] md:py-0.5 text-[8px] md:text-[10px] font-mono text-white/30 truncate max-w-[200px]">
                  {project.url.replace("https://", "")}
                </div>
              </div>
              
              {/* Iframe Viewport */}
              <div className="absolute top-6 md:top-8 inset-x-0 bottom-0 overflow-hidden bg-white/5">
                {!loadedDesktop && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
                  </div>
                )}
                <iframe
                  src={project.url}
                  onLoad={() => setLoadedDesktop(true)}
                  className={`w-[200%] h-[200%] border-none origin-top-left scale-[0.5] transition-opacity duration-700 ${loadedDesktop ? 'opacity-100' : 'opacity-0'}`}
                  title={`${project.title} Desktop`}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>
          {/* Bottom Lip */}
          <div className="absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2 w-[110%] h-4 md:h-6 bg-gradient-to-b from-[#2a2a2a] to-[#111] rounded-b-[1.5rem] md:rounded-b-[3rem] shadow-xl z-[-1]" />
          <div className="absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2 w-[20%] h-1 md:h-2 bg-[#111] rounded-b-xl" />
        </div>

        {/* Mobile Mockup */}
        <div className="relative w-[260px] md:w-[320px] aspect-[9/19] shrink-0 xl:w-[28%] xl:mt-0 mt-8">
          <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3rem] border-8 border-[#1a1a1a] dark:border-[#2a2a2a] bg-[#0a0a0a] shadow-2xl p-1 md:p-1.5 overflow-hidden">
             {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-5 md:h-6 bg-[#1a1a1a] dark:bg-[#2a2a2a] rounded-b-xl z-20" />
            
            {/* Screen */}
            <div className="relative w-full h-full rounded-[2rem] md:rounded-[2.5rem] bg-[#111] overflow-hidden">
              <div className="absolute inset-0 overflow-hidden bg-white/5">
                {!loadedMobile && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
                  </div>
                )}
                <iframe
                  src={project.url}
                  onLoad={() => setLoadedMobile(true)}
                  className={`w-full h-full border-none transition-opacity duration-700 ${loadedMobile ? 'opacity-100' : 'opacity-0'}`}
                  title={`${project.title} Mobile`}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
