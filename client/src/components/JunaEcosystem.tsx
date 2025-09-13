import { useState, useEffect, useRef, useMemo } from "react";
import { MessageCircle, Mic, UserCircle, Brain, Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface JunaNode {
  id: string;
  title: string;
  position: { x: number; y: number };
  icon: React.ReactNode;
  color: string;
  demoContent: React.ReactNode;
}

export default function JunaEcosystem() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [isPulsing, setIsPulsing] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  
  // Memoized particles for consistent performance
  const particles = useMemo(() => {
    return [...Array(6)].map(() => ({
      x: 45 + Math.random() * 10,
      y: 45 + Math.random() * 10,
      deltaX: Math.random() * 100 - 50,
      deltaY: Math.random() * 100 - 50,
      duration: 4 + Math.random() * 2
    }));
  }, []);

  // Juna nodes positioned around the center
  const nodes: JunaNode[] = [
    {
      id: "chat",
      title: "Chat-Juna",
      position: { x: -120, y: -80 }, // Top left
      icon: <MessageCircle className="w-8 h-8" />,
      color: "var(--cyan-glow)",
      demoContent: (
        <div className="p-6 space-y-4">
          <div className="bg-slate-700 rounded-lg p-3 text-sm">
            <strong>Besucher:</strong> Seid ihr DSGVO-konform?
          </div>
          <div className="bg-cyan-900/50 rounded-lg p-3 text-sm border border-cyan-500/30">
            <strong>Juna:</strong> Ja. EU-Hosting, Datenminimierung und klare Löschfristen.
          </div>
        </div>
      )
    },
    {
      id: "voice", 
      title: "Voice-Juna",
      position: { x: 120, y: -80 }, // Top right
      icon: <Mic className="w-8 h-8" />,
      color: "var(--jade-accent)",
      demoContent: (
        <div className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="rounded-full w-16 h-16 bg-jade-accent hover:bg-jade-accent/80"
              aria-label="Voice-Demo abspielen"
            >
              <Play className="w-6 h-6" />
            </Button>
          </div>
          <p className="text-sm text-slate-300">
            "Du sprichst im Browser, Juna antwortet in Echtzeit – ohne Telefon."
          </p>
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-jade-accent rounded-full"
                animate={prefersReducedMotion ? { height: 12 } : { height: [4, 20, 4] }}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 1, 
                  repeat: prefersReducedMotion ? 0 : Infinity, 
                  delay: prefersReducedMotion ? 0 : i * 0.1 
                }}
              />
            ))}
          </div>
        </div>
      )
    },
    {
      id: "avatar",
      title: "Avatar-Juna", 
      position: { x: -120, y: 80 }, // Bottom left
      icon: <UserCircle className="w-8 h-8" />,
      color: "var(--berry-highlight)",
      demoContent: (
        <div className="p-6 text-center space-y-4">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-pink-500/30">
            <UserCircle className="w-16 h-16 text-pink-400" />
          </div>
          <p className="text-sm text-slate-300">
            "Hi, ich bin Juna. Ich begrüße dich und führe dich zügig zum Ziel."
          </p>
        </div>
      )
    },
    {
      id: "knowledge",
      title: "Wissens-Juna",
      position: { x: 120, y: 80 }, // Bottom right  
      icon: <Brain className="w-8 h-8" />,
      color: "var(--cyan-glow)",
      demoContent: (
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="bg-slate-700 rounded-lg p-3 text-sm">
              <strong>FAQ · Preise & Abrechnung</strong><br />
              <span className="text-slate-400">Einrichtung + Servicepauschale</span>
            </div>
            <div className="bg-slate-700 rounded-lg p-3 text-sm">
              <strong>Prozess · Rollout & Schulung</strong><br />
              <span className="text-slate-400">kurz erklärt</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Focus management and escape key handler
  useEffect(() => {
    if (activeDemo) {
      // Store last focused element
      lastFocusedElementRef.current = document.activeElement as HTMLElement;
      
      // Focus trap and escape handler
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setActiveDemo(null);
          return;
        }
        
        // Simple focus trap
        if (e.key === 'Tab') {
          const modal = document.querySelector('[data-testid="demo-modal"]');
          const focusableElements = modal?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      
      // Focus close button initially
      setTimeout(() => {
        const closeButton = document.querySelector('[data-testid="close-demo"]') as HTMLElement;
        closeButton?.focus();
      }, 100);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        // Restore focus when modal closes
        if (lastFocusedElementRef.current) {
          lastFocusedElementRef.current.focus();
        }
      };
    }
  }, [activeDemo]);

  // Respect prefers-reduced-motion for all animations
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      const reduced = mediaQuery.matches;
      setPrefersReducedMotion(reduced);
      setIsPulsing(!reduced);
    };
    
    handleChange(); // Initial check
    mediaQuery.addListener(handleChange);
    
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return (
    <div className="relative w-full h-96 flex items-center justify-center" data-testid="juna-ecosystem">
      {/* Connection lines SVG */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        style={{ zIndex: 1 }}
        aria-hidden="true"
        focusable="false"
      >
        {nodes.map((node, index) => (
          <motion.line
            key={node.id}
            x1="50%"
            y1="50%" 
            x2={`${50 + (node.position.x / 4)}%`}
            y2={`${50 + (node.position.y / 4)}%`}
            stroke="url(#connectionGradient)"
            strokeWidth="2"
            opacity={0.6}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: prefersReducedMotion ? 1 : 1 }}
            transition={{ 
              duration: prefersReducedMotion ? 0 : 1.5, 
              delay: prefersReducedMotion ? 0 : index * 0.2 
            }}
          />
        ))}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--cyan-glow)" />
            <stop offset="100%" stopColor="var(--jade-accent)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Central Juna */}
      <motion.div
        className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-jade-500 flex items-center justify-center shadow-2xl"
        animate={{
          scale: (isPulsing && !activeDemo) ? [1, 1.1, 1] : 1,
          boxShadow: (isPulsing && !activeDemo) ? [
            "0 0 20px rgba(6, 182, 212, 0.3)",
            "0 0 40px rgba(6, 182, 212, 0.6)", 
            "0 0 20px rgba(6, 182, 212, 0.3)"
          ] : "0 0 20px rgba(6, 182, 212, 0.3)"
        }}
        transition={{ duration: 2, repeat: Infinity }}
        data-testid="juna-center"
      >
        <span className="text-slate-900 font-bold text-xl">Juna</span>
      </motion.div>

      {/* Floating particles */}
      {!prefersReducedMotion && particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          animate={{
            x: [0, particle.deltaX],
            y: [0, particle.deltaY],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}

      {/* Product nodes */}
      {nodes.map((node) => (
        <motion.button
          key={node.id}
          className={`absolute z-20 w-16 h-16 rounded-full glass flex items-center justify-center border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
            prefersReducedMotion ? '' : 'hover:scale-110 focus:scale-110'
          }`}
          style={{
            left: `calc(50% + ${node.position.x}px)`,
            top: `calc(50% + ${node.position.y}px)`,
            borderColor: node.color,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => setActiveDemo(node.id)}
          whileHover={prefersReducedMotion ? {} : { 
            boxShadow: `0 0 30px ${node.color}40` 
          }}
          data-testid={`juna-node-${node.id}`}
          aria-label={`${node.title} Demo öffnen`}
        >
          <span style={{ color: node.color }}>
            {node.icon}
          </span>
        </motion.button>
      ))}

      {/* Demo overlays */}
      <AnimatePresence>
        {activeDemo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`demo-title-${activeDemo}`}
            initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={() => setActiveDemo(null)}
            data-testid="demo-overlay"
          >
            <motion.div
              className="glass max-w-md w-full mx-4 relative"
              initial={{ scale: prefersReducedMotion ? 1 : 0.8, opacity: prefersReducedMotion ? 1 : 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: prefersReducedMotion ? 1 : 0.8, opacity: prefersReducedMotion ? 1 : 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="demo-modal"
            >
              <div className="flex justify-between items-center p-4 border-b border-slate-600">
                <h3 
                  id={`demo-title-${activeDemo}`}
                  className="text-lg font-semibold text-cyan-400"
                >
                  {nodes.find(n => n.id === activeDemo)?.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveDemo(null)}
                  className="text-slate-400 hover:text-white"
                  data-testid="close-demo"
                  aria-label="Demo schließen"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {nodes.find(n => n.id === activeDemo)?.demoContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility hint */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-slate-400 text-center">
        <p>Juna ist ein Support-Assistent ohne Zugriff auf Bestellungen, Rechnungen oder Kundendaten.</p>
      </div>
    </div>
  );
}