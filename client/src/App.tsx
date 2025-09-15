import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Kontakt from "@/pages/Kontakt";
import UeberUns from "@/pages/UeberUns";
import KundenTest from "@/pages/KundenTest";
import Admin from "@/pages/Admin";
import Datenschutz from "@/pages/Datenschutz";
import Impressum from "@/pages/Impressum";
import Bildnachweise from "@/pages/Bildnachweise";
import ProductDetail from "@/pages/ProductDetail";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AccessibilityBanner from "@/components/AccessibilityBanner";
import SEOHelmet from "@/components/SEOHelmet";
import ChatbotWidget from "@/components/ChatbotWidget";
import { testSessionManager } from "@/lib/testSession";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/kontakt" component={Kontakt} />
      <Route path="/ueber-uns" component={UeberUns} />
      <Route path="/kunden-test" component={KundenTest} />
      <Route path="/kundentest" component={KundenTest} />
      <Route path="/test" component={KundenTest} />
      <Route path="/admin" component={Admin} />
      <Route path="/datenschutz" component={Datenschutz} />
      <Route path="/impressum" component={Impressum} />
      <Route path="/bildnachweise" component={Bildnachweise} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  
  // Routes where Juna bubbles should NOT appear
  const noJunaRoutes = ['/kunden-test', '/kundentest', '/test', '/admin'];
  const showJunaBubbles = !noJunaRoutes.includes(location);

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
    
    // Initialize test session manager
    testSessionManager.init();
    
    // Cleanup on app unmount
    return () => {
      testSessionManager.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <SEOHelmet 
            title="Zoë's KI Service - AI Assistenten für Ihr Unternehmen"
            description="Professionelle KI-Assistenten: Chatbots, Voicebots und Avatare. Entlasten Sie Ihr Team mit intelligenten Lösungen."
          />
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
          <AccessibilityBanner />
          
          {/* Global Chat/Voice Widgets - Only show on pages that should have Juna bubbles */}
          {showJunaBubbles && <ChatbotWidget />}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
