import { useState } from 'react';
import { SimpleChatbot, ChatbotButton } from './SimpleChatbot';

export default function ChatbotWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <SimpleChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ChatbotButton onClick={() => setIsChatOpen(true)} />
    </>
  );
}