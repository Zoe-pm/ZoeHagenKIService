import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SimpleChatbot, ChatbotButton } from "./SimpleChatbot";
import VoicebotWidget, { VoiceButton } from "./VoicebotWidget";

export default function ChatbotWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const el = document.createElement("div");
  el.id = "floating-dock";
  useEffect(() => {
    document.body.appendChild(el);
    const set = (p: string, v: string) => el.style.setProperty(p, v, "important");
    set("position","fixed");
    set("right","16px");
    set("bottom","calc(16px + env(safe-area-inset-bottom))");
    set("z-index","2147483647");
    set("display","flex"); set("flex-direction","column");
    set("gap","12px"); set("align-items","flex-end");
    return () => el.remove();
  }, []);

  return (
    <>
      {/* Juna Chat - Text Chatbot */}
      <SimpleChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Juna Voice - Voice Assistant */}
      <VoicebotWidget isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />

      {createPortal(
        <>
          <VoiceButton onClick={() => setIsVoiceOpen(true)} />
          <ChatbotButton onClick={() => setIsChatOpen(true)} />
        </>, el
      )}
    </>
  );
}