import { MessageCircle, Volume2 } from 'lucide-react';
import type { IModeAdapter } from './ModeAdapters';

interface TestConfig {
  activeBot: "chatbot" | "voicebot";
  chatbot: {
    name: string;
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    textBackgroundColor: string;
    widgetSize: string;
    fontFamily: string;
    position: string;
    greeting: string;
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    logoUrl: string;
    logoPosition: string;
    logoSize: string;
  };
  voicebot: {
    name: string;
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    textBackgroundColor: string;
    widgetSize: string;
    position: string;
    voiceSpeed: number[];
    voicePitch: number[];
    elevenLabsVoiceId: string;
    greeting: string;
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    logoUrl: string;
    logoPosition: string;
    logoSize: string;
  };
}

interface TestChatBubbleButtonProps {
  config: TestConfig;
  onClick: () => void;
  isVisible: boolean;
  modeAdapter?: IModeAdapter;
}

export function TestChatBubbleButton({ config, onClick, isVisible, modeAdapter }: TestChatBubbleButtonProps) {
  if (!isVisible) return null;

  const currentConfig = config.activeBot === "chatbot" ? config.chatbot : config.voicebot;
  
  // Size mapping for bubble
  const bubbleSizes = {
    small: { size: 'w-12 h-12', textSize: 'text-xs', iconSize: 'w-4 h-4' },
    medium: { size: 'w-16 h-16', textSize: 'text-sm', iconSize: 'w-5 h-5' },
    large: { size: 'w-20 h-20', textSize: 'text-base', iconSize: 'w-6 h-6' }
  };

  const sizeConfig = bubbleSizes[currentConfig.widgetSize as keyof typeof bubbleSizes] || bubbleSizes.medium;
  
  // Position mapping
  const positionStyles = {
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' }
  };

  const positionStyle = positionStyles[currentConfig.position as keyof typeof positionStyles] || positionStyles['bottom-right'];

  return (
    <>
      {/* Main Chat Bubble */}
      <div
        className={`fixed ${sizeConfig.size} rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center border-2 border-white/20 z-[9998]`}
        style={{
          backgroundColor: currentConfig.primaryColor,
          ...positionStyle,
          fontFamily: config.activeBot === "chatbot" ? config.chatbot.fontFamily : 'Inter'
        }}
        onClick={onClick}
        data-testid="test-chat-bubble-button"
        role="button"
        aria-label={`${currentConfig.name} Chat öffnen`}
      >
        {/* Logo if configured */}
        {currentConfig.logoUrl ? (
          <img 
            src={currentConfig.logoUrl}
            alt={currentConfig.name}
            className={`
              ${currentConfig.logoSize === 'small' ? 'w-4 h-4' :
                currentConfig.logoSize === 'large' ? 'w-8 h-8' : 
                'w-6 h-6'}
              rounded object-cover
            `}
          />
        ) : (
          /* Fallback to icon */
          config.activeBot === "chatbot" ? (
            <MessageCircle className={`${sizeConfig.iconSize} text-white`} />
          ) : (
            <Volume2 className={`${sizeConfig.iconSize} text-white`} />
          )
        )}
      </div>

      {/* Name Badge */}
      <div
        className={`fixed ${sizeConfig.textSize} font-medium text-white bg-black/80 px-2 py-1 rounded-full shadow-lg z-[9997] transition-all duration-300 whitespace-nowrap`}
        style={{
          ...positionStyle,
          // Position badge above bubble
          bottom: `${parseInt(positionStyle.bottom?.replace('px', '') || '20') + (sizeConfig.size.includes('12') ? 60 : sizeConfig.size.includes('16') ? 80 : 100)}px`,
          ...(currentConfig.position === 'center' && {
            left: '50%',
            transform: 'translateX(-50%)'
          })
        }}
        data-testid="test-chat-bubble-name"
      >
        {currentConfig.name || (config.activeBot === "chatbot" ? "Chatbot" : "Voicebot")}
      </div>
    </>
  );
}