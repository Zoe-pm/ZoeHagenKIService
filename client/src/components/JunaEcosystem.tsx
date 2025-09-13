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
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  
  // Voice synthesis function
  const playVoiceDemo = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis wird von Ihrem Browser nicht unterstützt.');
      return;
    }
    
    if (isVoicePlaying) {
      speechSynthesis.cancel();
      setIsVoicePlaying(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(
      'Natürlich; du sprichst im Browser, Juna antwortet in Echtzeit.'
    );
    utterance.lang = 'de-DE';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsVoicePlaying(true);
    utterance.onend = () => setIsVoicePlaying(false);
    utterance.onerror = () => setIsVoicePlaying(false);
    
    speechSynthesis.speak(utterance);
  };
  
  // Responsive particle count and memoized for consistent performance
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 150);
    };
    
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, []);
  
  const particles = useMemo(() => {
    const particleCount = isMobile ? 2 : 4; // Weiter reduziert für Performance
    return [...Array(particleCount)].map(() => ({
      x: 45 + Math.random() * 10,
      y: 45 + Math.random() * 10,
      deltaX: Math.random() * (isMobile ? 40 : 80) - (isMobile ? 20 : 40),
      deltaY: Math.random() * (isMobile ? 40 : 80) - (isMobile ? 20 : 40),
      duration: 3 + Math.random() * 1.5 // Schnellere Animationen für weniger CPU-Last
    }));
  }, [isMobile]);

  // Juna nodes positioned around the center - responsive positioning
  const getNodePositions = () => {
    if (isMobile) {
      return {
        chat: { x: -70, y: -50 },
        voice: { x: 70, y: -50 },
        avatar: { x: -70, y: 50 },
        knowledge: { x: 70, y: 50 }
      };
    }
    return {
      chat: { x: -120, y: -80 },
      voice: { x: 120, y: -80 },
      avatar: { x: -120, y: 80 },
      knowledge: { x: 120, y: 80 }
    };
  };
  
  const nodePositions = getNodePositions();
  
  const nodes: JunaNode[] = [
    {
      id: "chat",
      title: "Chat-Juna",
      position: nodePositions.chat,
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
      position: nodePositions.voice,
      icon: <Mic className="w-8 h-8" />,
      color: "var(--jade-accent)",
      demoContent: (
        <div className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className={`rounded-full w-16 h-16 transition-all duration-300 ${
                isVoicePlaying 
                  ? 'bg-berry-highlight hover:bg-berry-highlight/80 shadow-lg shadow-pink-500/30' 
                  : 'bg-jade-accent hover:bg-jade-accent/80'
              }`}
              onClick={playVoiceDemo}
              aria-label={isVoicePlaying ? "Voice-Demo stoppen" : "Voice-Demo abspielen"}
              data-testid="button-voice-demo"
            >
              {isVoicePlaying ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Mic className="w-6 h-6" />
                </motion.div>
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>
          </div>
          <p className="text-sm text-slate-300">
            {isVoicePlaying 
              ? '🎵 Juna spricht gerade...' 
              : '"Du sprichst im Browser, Juna antwortet in Echtzeit – ohne Telefon."'
            }
          </p>
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-jade-accent rounded-full"
                animate={prefersReducedMotion ? { height: 12 } : {
                  height: isVoicePlaying ? [4, 24, 8, 20, 4] : [4, 20, 4]
                }}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : (isVoicePlaying ? 0.6 : 1), 
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
      position: nodePositions.avatar,
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
      position: nodePositions.knowledge,  
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

  // Cleanup voice when modal closes
  useEffect(() => {
    if (activeDemo !== 'voice' && isVoicePlaying) {
      speechSynthesis.cancel();
      setIsVoicePlaying(false);
    }
  }, [activeDemo, isVoicePlaying]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isVoicePlaying) {
        speechSynthesis.cancel();
      }
    };
  }, [isVoicePlaying]);
  
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
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="relative w-full h-[480px] flex items-center justify-center" data-testid="juna-ecosystem">
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
            stroke={activeDemo === node.id ? "url(#activeConnectionGradient)" : "url(#connectionGradient)"}
            strokeWidth={activeDemo === node.id ? "3" : "2"}
            opacity={activeDemo === node.id ? 0.9 : 0.7}
            filter={activeDemo === node.id ? "url(#nervePulse)" : "none"}
            strokeDasharray={activeDemo === node.id ? "5,5" : "none"}
            strokeDashoffset={activeDemo === node.id ? 0 : 0}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: prefersReducedMotion ? 1 : 1 }}
            transition={{ 
              duration: prefersReducedMotion ? 0 : 1.5, 
              delay: prefersReducedMotion ? 0 : index * 0.2 
            }}
          />
        ))}
        
        {/* Enhanced gradient definitions */}
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--cyan-glow)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--jade-accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--cyan-glow)" stopOpacity="0.6" />
          </linearGradient>
          
          {/* Animated gradient for active connections */}
          <linearGradient id="activeConnectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--cyan-glow)" stopOpacity="1">
              <animate attributeName="stop-opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="var(--jade-accent)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--berry-highlight)" stopOpacity="0.8">
              <animate attributeName="stop-opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          
          {/* Pulsing filter for nerve-like effect */}
          <filter id="nervePulse">
            <feGaussianBlur stdDeviation="1" />
            <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      {/* Central Juna Portrait in Glass Sphere */}
      <div className="relative z-10" data-testid="juna-center">
        {/* Outer glass sphere with breathing animation */}
        <motion.div
          className={`${isMobile ? 'w-32 h-32' : 'w-40 h-40'} rounded-full relative`}
          animate={{
            scale: (isPulsing && !activeDemo) ? [1, 1.03, 1] : 1,
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Glass sphere backdrop */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 25%, rgba(6, 182, 212, 0.15), rgba(16, 185, 129, 0.1), rgba(15, 23, 42, 0.3))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              boxShadow: (isPulsing && !activeDemo) ? '0 0 40px rgba(6, 182, 212, 0.3), inset 0 0 30px rgba(6, 182, 212, 0.1)' : '0 0 20px rgba(6, 182, 212, 0.2)'
            }}
          />
          
          {/* Light rays */}
          {!prefersReducedMotion && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
                  style={{
                    height: '60px',
                    left: '50%',
                    top: '50%',
                    transformOrigin: '0 30px',
                    transform: `rotate(${i * 60}deg) translateX(-50%)`
                  }}
                  animate={{
                    opacity: [0.2, 0.6, 0.2],
                    scaleY: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}
          
          {/* Stylized female portrait */}
          <div 
            className="absolute inset-2 rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 60%, #475569 100%)',
            }}
          >
            {/* Portrait silhouette with duotone effect */}
            <div 
              className="w-full h-full relative"
              style={{
                background: `
                  radial-gradient(ellipse 45% 60% at 50% 45%, 
                    rgba(6, 182, 212, 0.8) 0%, 
                    rgba(16, 185, 129, 0.6) 35%, 
                    rgba(15, 23, 42, 0.9) 70%, 
                    transparent 100%),
                  radial-gradient(ellipse 25% 35% at 45% 35%, 
                    rgba(6, 182, 212, 0.4) 0%, 
                    transparent 60%),
                  radial-gradient(ellipse 25% 35% at 55% 35%, 
                    rgba(6, 182, 212, 0.4) 0%, 
                    transparent 60%),
                  radial-gradient(ellipse 30% 20% at 50% 55%, 
                    rgba(16, 185, 129, 0.3) 0%, 
                    transparent 70%)
                `,
                filter: 'contrast(1.1) blur(0.5px)',
              }}
            >
              {/* Film grain texture overlay */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay'
                }}
              />
              
              {/* Subtle inner glow */}
              <motion.div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
                }}
                animate={{
                  opacity: (isPulsing && !activeDemo) ? [0.3, 0.7, 0.3] : 0.4
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
          
          {/* Name label */}
          <motion.div 
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{
              opacity: (isPulsing && !activeDemo) ? [0.7, 1, 0.7] : 0.8
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-cyan-300 font-medium text-sm tracking-wide">Juna</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Flowing data particles along connection lines */}
      {!prefersReducedMotion && nodes.map((node, nodeIndex) => (
        <div key={`particles-${node.id}`} className="absolute inset-0">
          {/* Multiple particles per line for continuous flow */}
          {[...Array(3)].map((_, particleIndex) => {
            // Calculate particle path from center to node
            const startX = 50; // Center percentage
            const startY = 50; // Center percentage
            const endX = 50 + (node.position.x / (isMobile ? 8 : 10));
            const endY = 50 + (node.position.y / (isMobile ? 8 : 10));
            
            return (
              <motion.div
                key={`particle-${nodeIndex}-${particleIndex}`}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: `linear-gradient(45deg, ${node.color}80, ${node.color}ff)`,
                  boxShadow: `0 0 8px ${node.color}60`,
                  filter: 'blur(0.5px)'
                }}
                initial={{
                  left: `${startX}%`,
                  top: `${startY}%`,
                  opacity: 0
                }}
                animate={{
                  left: [`${startX}%`, `${endX}%`, `${startX}%`],
                  top: [`${startY}%`, `${endY}%`, `${startY}%`],
                  opacity: hoveredNodeId === node.id 
                    ? [0, 1, 1, 1, 0.9, 0] // Intensiver bei Hover
                    : [0, 1, 1, 0.8, 0],
                  scale: hoveredNodeId === node.id 
                    ? [0.5, 1.2, 1.2, 0.8] // Größer bei Hover
                    : [0.5, 1, 1, 0.5]
                }}
                transition={{
                  duration: hoveredNodeId === node.id 
                    ? (isMobile ? 1.5 : 2) + particleIndex * 0.2 // Schneller bei Hover
                    : (isMobile ? 3 + particleIndex * 0.3 : 4 + particleIndex * 0.5),
                  repeat: Infinity,
                  delay: particleIndex * 1.0 + nodeIndex * 0.2,
                  ease: "linear"
                }}
              />
            );
          })}
        </div>
      ))}

      {/* Product nodes */}
      {nodes.map((node) => (
        <motion.button
          key={node.id}
          className={`absolute z-20 ${isMobile ? 'w-14 h-14' : 'w-16 h-16'} rounded-full glass flex items-center justify-center border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ${
            prefersReducedMotion ? '' : 'hover:scale-[1.08] focus:scale-[1.08]'
          }`}
          style={{
            left: `calc(50% + ${node.position.x}px)`,
            top: `calc(50% + ${node.position.y}px)`,
            borderColor: node.color,
            transform: 'translate(-50%, -50%)',
            ...(isMobile && { touchAction: 'manipulation' })
          }}
          onClick={() => setActiveDemo(node.id)}
          onMouseEnter={() => !prefersReducedMotion && setHoveredNodeId(node.id)}
          onMouseLeave={() => setHoveredNodeId(null)}
          whileHover={prefersReducedMotion ? {} : { 
            scale: 1.08,
            boxShadow: `0 0 40px ${node.color}80, 0 0 20px ${node.color}60`,
            borderColor: node.color,
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
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