import { useState, useEffect } from 'react';
import { Portal } from "@radix-ui/react-portal";
import { SimpleChatbot, ChatbotButton } from "./SimpleChatbot";
import VoicebotWidget, { VoiceButton } from "./VoicebotWidget";

export default function ChatbotWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Listen for custom events from product buttons
  useEffect(() => {
    const handleOpenChat = () => setIsChatOpen(true);
    const handleOpenVoice = () => setIsVoiceOpen(true);

    window.addEventListener('open-chat', handleOpenChat);
    window.addEventListener('open-voice', handleOpenVoice);

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

      <Portal>
        <div
          id="floating-dock"
          className="
            fixed
            right-4 bottom-[calc(env(safe-area-inset-bottom)+16px)]
            md:right-6 md:bottom-6
            z-[2147483647]
            flex flex-col items-end gap-3
          "
        >
          <VoiceButton onClick={() => setIsVoiceOpen(true)} />
          <ChatbotButton onClick={() => setIsChatOpen(true)} />
        </div>
      </Portal>
    </>
  );
}