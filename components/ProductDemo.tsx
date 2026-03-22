"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileCode, 
  ArrowRight, 
  GitBranch, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight
} from "lucide-react";

/**
 * File Card Component
 */
const FileCard = ({ name, pos, neg, icon: Icon }: { name: string; pos: number; neg: number; icon: any }) => (
  <motion.div 
    layout
    className="bg-metal/60 border border-white/5 rounded-xl p-3 flex items-center justify-between group hover:border-primary/30 transition-colors shadow-lg"
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary/60 group-hover:text-primary transition-colors">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-sm font-bold text-white/90">{name}</div>
        <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Source File</div>
      </div>
    </div>
    <div className="flex gap-2 text-[10px] font-black font-mono">
      <span className="text-green-500">+{pos}</span>
      <span className="text-red-500">-{neg}</span>
    </div>
  </motion.div>
);

/**
 * Virtual Branch Lane Component
 */
const BranchLane = ({ title, branch, cards, active = false, color = "primary" }: { 
  title: string; 
  branch: string; 
  cards: any[]; 
  active?: boolean;
  color?: "primary" | "secondary" | "muted"
}) => {
  const colorClass = color === "primary" ? "text-primary border-primary/20" : color === "secondary" ? "text-secondary border-secondary/20" : "text-white/40 border-white/10";
  const glowClass = color === "primary" ? "shadow-[0_0_20px_rgba(0,212,255,0.05)]" : color === "secondary" ? "shadow-[0_0_20px_rgba(123,97,255,0.05)]" : "";
  
  return (
    <div className={`flex flex-col h-full bg-white/5 border border-white/5 rounded-[24px] p-4 ${glowClass} relative overflow-hidden group/lane`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${colorClass}`}>{title}</div>
          {active && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
        </div>
        <div className="flex items-center gap-2">
          <GitBranch className={`h-4 w-4 ${colorClass}`} />
          <span className="text-sm font-bold text-white/90">{branch}</span>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {cards.map((card, i) => (
          <FileCard key={card.name} {...card} />
        ))}
        <div className="h-20 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-white/10 text-xs font-bold uppercase tracking-widest italic">
          Drop files here
        </div>
      </div>

      <div className="mt-6">
        <button className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
          color === 'muted' 
          ? 'bg-white/5 text-white/40 cursor-not-allowed' 
          : 'bg-primary/10 border border-primary/20 text-primary hover:bg-primary sm:hover:text-black glow-cyan'
        }`}>
          {color === 'muted' ? 'No Changes' : 'Push to GitHub'}
          {color !== 'muted' && <ArrowUpRight className="h-3 w-3" />}
        </button>
      </div>
    </div>
  );
};

/**
 * AI Commit Card Component
 */
const AICommitCard = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showComplete, setShowComplete] = useState(false);

  const messages = [
    { branch: "feature/auth-system", text: "feat(auth): implement Firebase RSVP authentication system" },
    { branch: "fix/navbar", text: "fix(navbar): resolve responsive layout on mobile viewports" }
  ];

  useEffect(() => {
    let charIndex = 0;
    const currentMessage = messages[msgIndex].text;
    
    setDisplayText("");
    setIsTyping(true);
    setShowComplete(false);

    const typingInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setDisplayText(currentMessage.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setShowComplete(true);
        
        // Wait 1.5s after finishing then loop to next message
        setTimeout(() => {
          setMsgIndex((prev) => (prev + 1) % messages.length);
        }, 1500);
      }
    }, 45); // Adjust typing speed here

    return () => clearInterval(typingInterval);
  }, [msgIndex]);

  return (
    <motion.div 
      animate={{ 
        boxShadow: showComplete ? "0 0 40px rgba(74, 222, 128, 0.2)" : "0 0 20px rgba(0, 0, 0, 0.3)",
        borderColor: showComplete ? "rgba(74, 222, 128, 0.3)" : "rgba(255, 255, 255, 0.05)"
      }}
      className="glass bg-metal/80 border rounded-2xl p-6 w-full max-w-sm transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">AI Commit</div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
             <span className={`relative flex h-1.5 w-1.5 ${showComplete ? "bg-green-500" : ""}`}>
              {!showComplete && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${showComplete ? "bg-green-500" : "bg-green-500/80"}`}></span>
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${showComplete ? "text-green-400" : "text-white/40"}`}>
              {showComplete ? "Ready to Commit" : "Generating"}
            </span>
          </div>
        </div>
        {showComplete && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-400">
            <CheckCircle2 className="h-4 w-4" />
          </motion.div>
        )}
      </div>

      <div className="mb-4">
        <div className="text-[11px] text-white/30 uppercase tracking-widest font-bold mb-1">target branch</div>
        <div className="flex items-center gap-2">
          <GitBranch className="h-3 w-3 text-white/40" />
          <span className="text-xs font-bold text-white/80">{messages[msgIndex].branch}</span>
        </div>
      </div>

      <div className="bg-black/40 rounded-xl p-4 border border-white/5 min-h-[80px] flex items-start">
        <div className="text-sm font-mono text-white/90 leading-relaxed relative">
          {displayText}
          {isTyping && (
            <motion.span 
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-1.5 h-4 bg-primary/60 ml-1 translate-y-0.5"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function ProductDemo() {
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDragActive(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-[#090909] relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT SIDE — Virtual Branch Lanes Mockup */}
          <div className="lg:col-span-7 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] relative">
              <BranchLane 
                title="Active Branch" 
                branch="feature/auth" 
                active={true}
                color="primary"
                cards={[
                  { name: "auth.ts", pos: 124, neg: 12, icon: FileCode },
                  { name: "login.tsx", pos: 67, neg: 4, icon: FileCode },
                ]}
              />
              <BranchLane 
                title="Active Branch" 
                branch="fix/navbar-bug" 
                color="secondary"
                cards={[
                  { name: "Navbar.tsx", pos: 45, neg: 23, icon: FileCode },
                ]}
              />
              <BranchLane 
                title="Workspace" 
                branch="Unassigned Changes" 
                color="muted"
                cards={[
                  { name: "globals.css", pos: 12, neg: 5, icon: FileCode },
                ]}
              />

              {/* Automated Drag Animation Overlay */}
              <AnimatePresence>
                {dragActive && (
                  <motion.div
                    initial={{ x: "66.6%", y: 160, opacity: 0, scale: 0.8 }}
                    animate={{ 
                      x: [ "66.6%", "0%" ],
                      y: [ 160, 280 ],
                      opacity: [ 1, 1, 0 ],
                      scale: [ 1, 1, 0.9 ]
                    }}
                    transition={{ 
                      duration: 2.5, 
                      times: [ 0, 0.8, 1 ],
                      ease: "easeInOut"
                    }}
                    className="absolute w-[calc(33.33%-16px)] z-40 pointer-events-none px-4"
                  >
                    <FileCard name="firebase.ts" pos={34} neg={8} icon={Sparkles} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Commit Card Overlay - Positioned floating over the lanes */}
            <div className="absolute -bottom-10 right-0 md:right-8 z-50 w-full max-w-sm filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <AICommitCard />
            </div>
          </div>

          {/* RIGHT SIDE — Marketing Copy */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-8">
                <Sparkles className="h-3 w-3" />
                Next-Gen Git Client
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tighter">
                Work on Everything. <br />
                <span className="text-primary italic">At Once.</span>
              </h2>
              <p className="text-xl text-white/50 mb-10 leading-relaxed font-medium">
                FluxGit lets you work on multiple branches simultaneously in the same working directory. 
                No stashing. No context switching. <span className="text-white italic">Just flow.</span>
              </p>

              <div className="space-y-6 mb-12">
                {[
                  "Drag file changes between branches",
                  "Commit each branch independently",
                  "Push to GitHub without switching branches"
                ].map((bullet, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-white/80 font-bold">{bullet}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                 <button className="glow-cyan w-full sm:w-auto px-10 py-5 bg-primary text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                    Start Your Flow
                    <ArrowRight className="h-5 w-5" />
                 </button>
                 <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
                    Read the Docs
                 </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[500px] h-[500px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />
    </section>
  );
}
