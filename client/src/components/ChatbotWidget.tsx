import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { SimpleChatbot, ChatbotButton } from "./SimpleChatbot";
import VoicebotWidget, { VoiceButton } from "./VoicebotWidget";

export default function ChatbotWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Use ref to maintain stable portal container across renders
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create stable container only once
    if (!containerRef.current) {
      containerRef.current = document.createElement("div");
      containerRef.current.id = "floating-dock";
    }

    const el = containerRef.current;
    document.body.appendChild(el);
    const set = (p: string, v: string) => el.style.setProperty(p, v, "important");
    set("position","fixed");
    set("right","16px");
    set("bottom","calc(16px + env(safe-area-inset-bottom))");
    set("z-index","2147483647");
    set("display","flex"); set("flex-direction","column");
    set("gap","12px"); set("align-items","flex-end");
    
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