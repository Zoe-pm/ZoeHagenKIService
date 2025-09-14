import { useState, useEffect } from 'react';
import { SimpleChatbot, ChatbotButton } from './SimpleChatbot';
import VoicebotWidget from './VoicebotWidget';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

// Voice button component (similar to ChatbotButton)
function VoiceButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-[10000] w-16 h-16 rounded-full bg-gradient-to-br from-[#e63973] to-[#E8719A] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white/20 pointer-events-auto"
      size="sm"
      data-testid="button-open-voice"
    >
      <Volume2 className="h-8 w-8 text-white drop-shadow-lg" />
    </Button>
  );
}

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
      <ChatbotButton onClick={() => setIsChatOpen(true)} />
      
      {/* Juna Voice - Voice Assistant */}
      <VoicebotWidget isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
      <VoiceButton onClick={() => setIsVoiceOpen(true)} />
    </>
  );
}