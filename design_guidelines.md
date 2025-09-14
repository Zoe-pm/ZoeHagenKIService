# Design Guidelines for Zoë's KI Service Website

## Design Approach: Reference-Based (Modern SaaS/AI Service)
Taking inspiration from contemporary AI service platforms like OpenAI, Anthropic, and modern SaaS landing pages. Focus on professional credibility with strategic use of gradients and dynamic elements.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Dark backgrounds: `210 15% 8%` (deep slate)
- Card backgrounds: `210 10% 12%` (slightly lighter slate)
- Text primary: `0 0% 98%` (near white)
- Text secondary: `210 5% 65%` (muted gray)

**Gradient Colors:**
- Pink to purple gradient: `320 85% 65%` → `280 75% 55%`
- Used for buttons, number circles (1,2,3,4), and accent elements
- Applied left-to-right direction consistently

### B. Typography
- Primary: Inter or similar modern sans-serif via Google Fonts
- Headers: Semi-bold to bold weights
- Body text: Regular weight with good line spacing
- Maintain excellent contrast against dark backgrounds

### C. Layout System
- Tailwind spacing: Primary units 4, 8, 12, 16 (p-4, m-8, gap-12, etc.)
- Generous whitespace for premium feel
- Consistent card spacing and padding

### D. Component Design

**Cards ("So arbeiten wir" section):**
- Dark background matching overall theme
- NO white borders or outlines
- Gradient number circles (1,2,3,4) with pink-to-purple gradient
- Consistent with homepage aesthetic

**Buttons:**
- Primary: Pink-to-purple gradient background
- When on images: variant="outline" with blurred background
- NO custom hover states (use default button interactions)

**Avatar/Voicebot Display:**
- Responsive image handling with proper object-fit
- Mobile-optimized sizing and positioning
- Ensure images load correctly across all devices

### E. Mobile Responsiveness
- Prioritize mobile-first design approach
- Ensure avatar images scale appropriately
- Maintain gradient consistency across breakpoints
- Touch-friendly button sizing

## Key Design Principles
1. **Consistency**: All gradient elements use same pink-to-purple direction
2. **Dark Theme**: Maintain dark aesthetic throughout
3. **Professional Trust**: Clean, modern styling that builds credibility
4. **Mobile-First**: Ensure all components work flawlessly on mobile devices
5. **No White Borders**: Avoid white outlines that break the dark theme cohesion

## Critical Implementation Notes
- Remove any white borders from dark-themed cards
- Ensure proper build configuration for deployment
- Test avatar/voicebot images thoroughly on mobile devices
- Maintain VAPI voice assistant functionality across all platforms