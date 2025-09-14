import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { SimpleChatbot, ChatbotButton } from "./SimpleChatbot";
import VoicebotWidget, { VoiceButton } from "./VoicebotWidget";

export default function ChatbotWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Use ref to maintain stable portal container across renders
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Check if mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
      // Mobile: horizontal layout and dynamic positioning
      set("flex-direction","row");
      if (isChatOpen) {
        // Move dock to left when chat is open on mobile
        set("left","16px");
        unset("right");
        set("align-items","flex-start");
      } else {
        // Default right position
        set("right","16px");
        unset("left");
        set("align-items","flex-end");
      }
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
    };

    const handleOpenVoice = () => {
      setIsVoiceOpen(true);
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

  return (
    <>
      {/* Juna Chat - Text Chatbot */}
      <SimpleChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Juna Voice - Voice Assistant */}
      <VoicebotWidget isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />

      {/* Only render portal when container is mounted */}
      {isMounted && containerRef.current && createPortal(
        <>
          <VoiceButton onClick={() => setIsVoiceOpen(true)} />
          <ChatbotButton onClick={() => setIsChatOpen(true)} />
        </>, containerRef.current
      )}
    </>
  );
}