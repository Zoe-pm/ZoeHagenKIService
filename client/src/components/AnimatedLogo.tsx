interface AnimatedLogoProps {
  compact?: boolean;
}

export default function AnimatedLogo({ compact = false }: AnimatedLogoProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3" data-testid="logo-compact">
        <svg 
          viewBox="0 0 100 100" 
          className="w-12 h-12 md:w-14 md:h-14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="z-grad-compact" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D81B60"/>
              <stop offset="50%" stopColor="#EC407A"/>
              <stop offset="100%" stopColor="#D81B60"/>
            </linearGradient>
          </defs>
          
          <circle cx="50" cy="50" r="45" fill="#2F3B47"/>
          <circle cx="50" cy="50" r="45" fill="none" stroke="#D81B60" strokeWidth="1" opacity="0.4"/>
          <path d="M 30 30 L 70 30 L 70 38 L 42 38 L 70 62 L 70 70 L 30 70 L 30 62 L 58 62 L 30 38 Z" fill="url(#z-grad-compact)"/>
        </svg>
        
        <div className="hidden sm:flex flex-col">
          <span 
            className="text-[#D81B60] font-bold text-lg leading-tight tracking-wide"
            style={{ fontFamily: 'var(--font-alan)' }}
            data-testid="text-zoe-hagen-compact"
          >
            Zoë Hagen
          </span>
          <span 
            className="text-[#D9D9D9] text-xs tracking-widest font-medium"
            style={{ fontFamily: 'var(--font-inter-tight)' }}
            data-testid="text-ki-consulting-compact"
          >
            KI CONSULTING
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto" style={{ height: '65vh', minHeight: '400px', maxHeight: '60vh' }} data-testid="logo-hero">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="z-grad-hero" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D81B60"/>
            <stop offset="25%" stopColor="#EC407A"/>
            <stop offset="50%" stopColor="#D81B60"/>
            <stop offset="75%" stopColor="#C2185B"/>
            <stop offset="100%" stopColor="#D81B60"/>
          </linearGradient>
        </defs>
        
        <circle cx="50" cy="50" r="45" fill="#2F3B47"/>
        <circle cx="50" cy="50" r="45" fill="none" stroke="#D81B60" strokeWidth="1" opacity="0.5"/>
        <path d="M 30 30 L 70 30 L 70 38 L 42 38 L 70 62 L 70 70 L 30 70 L 30 62 L 58 62 L 30 38 Z" fill="url(#z-grad-hero)"/>
      </svg>
      
      <div className="flex flex-col items-center text-center" style={{ marginTop: '-8vh' }}>
        <h1 
          className="text-[#D81B60] font-bold text-3xl md:text-4xl lg:text-5xl mb-2 tracking-wide"
          style={{ fontFamily: 'var(--font-alan)' }}
          data-testid="text-zoe-hagen-hero"
        >
          Zoë Hagen
        </h1>
        <p 
          className="text-[#D9D9D9] text-sm md:text-base lg:text-lg tracking-widest font-medium"
          style={{ fontFamily: 'var(--font-inter-tight)' }}
          data-testid="text-ki-consulting-hero"
        >
          KI CONSULTING
        </p>
      </div>
    </div>
  );
}
