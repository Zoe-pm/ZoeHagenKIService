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
      className="fixed bottom-4 right-20 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-accent shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white/20"
      size="sm"
      data-testid="button-open-voice"
    >
      <Volume2 className="h-7 w-7 text-white" />
    </Button>
  );
}

export default function ChatbotWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

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