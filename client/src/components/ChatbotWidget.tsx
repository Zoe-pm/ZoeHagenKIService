import { useState } from 'react';
import { SimpleChatbot, ChatbotButton } from './SimpleChatbot';
import VoicebotWidget from './VoicebotWidget';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

// Voice button component (similar to ChatbotButton)
function VoiceButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-20 z-50 w-14 h-14 rounded-full button-gradient shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      size="sm"
      data-testid="button-open-voice"
    >
      <Volume2 className="h-6 w-6 text-white" />
    </Button>
  );
}

export default function ChatbotWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  return (
    <>
      {/* Juna - Text Chatbot */}
      <SimpleChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ChatbotButton onClick={() => setIsChatOpen(true)} />
      
      {/* Zoia - Voice Assistant */}
      <VoicebotWidget isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
      <VoiceButton onClick={() => setIsVoiceOpen(true)} />
    </>
  );
}