import { Accessibility } from "lucide-react";

export default function AccessibilityBanner() {
  return (
    <div className="bg-accent text-accent-foreground py-2 px-4 text-center text-sm font-medium">
      <Accessibility className="inline-block w-4 h-4 mr-2" aria-hidden="true" />
      Diese Website ist barrierefrei gestaltet und WCAG 2.1 AA konform
    </div>
  );
}
