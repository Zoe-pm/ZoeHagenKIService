import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { JunaChatbot, JunaChatButton } from "./JunaChatbot";
import VoicebotWidget, { VoiceButton } from "./VoicebotWidget";

export default function ChatbotWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Use ref to maintain stable portal container across renders
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Check if mobile viewport using matchMedia
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    
    // Set initial value
    setIsMobile(mediaQuery.matches);
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  // Position floating dock responsively
  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const set = (p: string, v: string) => el.style.setProperty(p, v, "important");
    const unset = (p: string) => el.style.removeProperty(p);
    
    // Base positioning
    set("position","fixed");
    set("bottom","calc(16px + env(safe-area-inset-bottom))");
    set("z-index","2147483647");
    set("display","flex");
    set("gap","12px");
    set("pointer-events","none"); // Prevent dock from blocking input
    
    if (isMobile) {
      // Mobile: horizontal layout, always right (no jumping)
      set("flex-direction","row");
      set("right","16px");
      unset("left");
      set("align-items","flex-end");
    } else {
      // Desktop: vertical layout, always right
      set("flex-direction","column");
      set("right","16px");
      unset("left");
      set("align-items","flex-end");
    }
  }, [isMobile, isChatOpen]);

  useEffect(() => {
    // Create stable container only once
    if (!containerRef.current) {
      containerRef.current = document.createElement("div");
      containerRef.current.id = "floating-dock";
    }

    const el = containerRef.current;
    document.body.appendChild(el);
    setIsMounted(true);
    
    return () => {
      el.remove();
      setIsMounted(false);
    };
  }, []);


  // Listen for custom events from homepage product buttons
  useEffect(() => {
    const handleOpenChat = () => {
      setIsChatOpen(true);
      setIsVoiceOpen(false); // Close voice when opening chat
    };

    const handleOpenVoice = () => {
      setIsVoiceOpen(true);
      setIsChatOpen(false); // Close chat when opening voice
    };

    // Add event listeners for custom events
    window.addEventListener('open-chat', handleOpenChat);
    window.addEventListener('open-voice', handleOpenVoice);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('open-chat', handleOpenChat);
      window.removeEventListener('open-voice', handleOpenVoice);
    };
  }, []);

  // Outside-click detection to close widgets
  useEffect(() => {
    if (!isChatOpen && !isVoiceOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      const target = event.target as Element;
      // Check if click is outside all widget areas
      if (!target.closest('#juna-chat, #juna-voice, #floating-dock')) {
        setIsChatOpen(false);
        setIsVoiceOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [isChatOpen, isVoiceOpen]);

  return (
    <>
      {/* Juna Chat - Text Chatbot */}
      <JunaChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Juna Voice - Voice Assistant */}
      <VoicebotWidget isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />

      {/* Only render dock buttons when neither chat nor voice is open */}
      {isMounted && containerRef.current && !isChatOpen && !isVoiceOpen && createPortal(
        <>
          <VoiceButton onClick={() => {
            setIsVoiceOpen(true);
            setIsChatOpen(false); // Close chat when opening voice
          }} />
          <JunaChatButton onClick={() => {
            setIsChatOpen(true);
            setIsVoiceOpen(false); // Close voice when opening chat
          }} />
        </>, containerRef.current
      )}
    </>
  );
}