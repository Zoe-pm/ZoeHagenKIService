import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import SEOHelmet from "@/components/SEOHelmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SimpleChatbot } from "@/components/SimpleChatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TestConfig {
  theme: "light" | "dark" | "blue" | "green";
  position: "bottom-right" | "bottom-left" | "center";
  voiceSpeed: number[];
  voicePitch: number[];
  greeting: string;
}

export default function KundenTest() {
  const [location] = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [testConfig, setTestConfig] = useState<TestConfig>({
    theme: "blue",
    position: "bottom-right",
    voiceSpeed: [1],
    voicePitch: [1],
    greeting: "Hallo! Wie kann ich Ihnen heute helfen?"
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Einfache Token-basierte Authentifizierung
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    // Hier können verschiedene Tokens für verschiedene Kunden definiert werden
    const validTokens = [
      'demo-kunde-2024',
      'test-access-123',
      'kunde-preview-456'
    ];
    
    if (token && validTokens.includes(token)) {
      setIsAuthorized(true);
      setAccessToken(token);
    }
  }, [location]);

  const handleConfigChange = (key: keyof TestConfig, value: any) => {
    setTestConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetConfig = () => {
    setTestConfig({
      theme: "blue",
      position: "bottom-right", 
      voiceSpeed: [1],
      voicePitch: [1],
      greeting: "Hallo! Wie kann ich Ihnen heute helfen?"
    });
  };

  // Wenn nicht autorisiert, Zugangsformular anzeigen
  if (!isAuthorized) {
    return (
      <>
        <SEOHelmet 
          title="Kundentest – Geschützter Bereich"
          description="Geschützter Testbereich für Kunden"
        />
        
        <Navigation />
        
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="max-w-md mx-auto p-8">
            <Card className="glass">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-4">🔒 Geschützter Testbereich</CardTitle>
                <p className="text-muted-foreground">
                  Dieser Bereich ist nur für Kunden mit gültigem Zugangstoken zugänglich.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Zugangstoken eingeben:</label>
                  <input 
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Token eingeben..."
                    data-testid="access-token-input"
                  />
                </div>
                <Button 
                  onClick={() => {
                    const validTokens = ['demo-kunde-2024', 'test-access-123', 'kunde-preview-456'];
                    if (validTokens.includes(accessToken)) {
                      setIsAuthorized(true);
                    } else {
                      alert('Ungültiges Token. Bitte wenden Sie sich an Zoë\'s KI Studio.');
                    }
                  }}
                  className="w-full"
                  data-testid="access-submit"
                >
                  Zugang anfordern
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Sie haben noch kein Token? Kontaktieren Sie uns für einen Testzugang.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </>
    );
  }

  // Autorisierter Testbereich
  return (
    <>
      <SEOHelmet 
        title="KI-Assistent Testbereich"
        description="Testen und konfigurieren Sie Ihren persönlichen KI-Assistenten"
      />
      
      <Navigation />
      
      <main className="min-h-screen pt-20">
        {/* Header */}
        <section className="hero-gradient py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  KI-Assistent Testbereich
                </h1>
                <p className="text-white/80">
                  Testen Sie Ihren persönlichen Chatbot und passen Sie ihn an Ihre Bedürfnisse an.
                </p>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Token: {accessToken.slice(0, 8)}...
              </Badge>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Konfiguration */}
            <div className="lg:col-span-1">
              <Card className="glass sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    🎛️ Anpassungen
                    <Button variant="outline" size="sm" onClick={resetConfig}>
                      Zurücksetzen
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Design Theme */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Design-Theme</label>
                    <Select value={testConfig.theme} onValueChange={(value: any) => handleConfigChange('theme', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Theme wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Hell</SelectItem>
                        <SelectItem value="dark">Dunkel</SelectItem>
                        <SelectItem value="blue">Blau (Standard)</SelectItem>
                        <SelectItem value="green">Grün</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <Select value={testConfig.position} onValueChange={(value: any) => handleConfigChange('position', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Position wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Unten rechts</SelectItem>
                        <SelectItem value="bottom-left">Unten links</SelectItem>
                        <SelectItem value="center">Zentral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Voice Speed */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sprachgeschwindigkeit: {testConfig.voiceSpeed[0]}x
                    </label>
                    <Slider
                      value={testConfig.voiceSpeed}
                      onValueChange={(value) => handleConfigChange('voiceSpeed', value)}
                      max={2}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Voice Pitch */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Stimmlage: {testConfig.voicePitch[0]}x
                    </label>
                    <Slider
                      value={testConfig.voicePitch}
                      onValueChange={(value) => handleConfigChange('voicePitch', value)}
                      max={2}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Custom Greeting */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Begrüßungstext</label>
                    <textarea
                      value={testConfig.greeting}
                      onChange={(e) => handleConfigChange('greeting', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      rows={3}
                      placeholder="Ihre persönliche Begrüßung..."
                    />
                  </div>

                  <Button 
                    onClick={() => setIsChatOpen(true)}
                    className="w-full button-gradient"
                    size="lg"
                  >
                    🤖 Chatbot testen
                  </Button>

                </CardContent>
              </Card>
            </div>

            {/* Live Preview */}
            <div className="lg:col-span-2">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>📱 Live-Vorschau</CardTitle>
                  <p className="text-muted-foreground">
                    So wird Ihr Chatbot auf der Website erscheinen:
                  </p>
                </CardHeader>
                <CardContent className="min-h-[500px] relative">
                  <div 
                    className={`
                      p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 min-h-[400px] relative overflow-hidden
                      ${testConfig.theme === 'dark' ? 'bg-gray-900' : testConfig.theme === 'blue' ? 'bg-blue-50' : testConfig.theme === 'green' ? 'bg-green-50' : 'bg-white'}
                    `}
                  >
                    <div className="text-center text-muted-foreground py-20">
                      <p className="mb-4">Ihre Website-Vorschau</p>
                      <p className="text-sm">Der Chatbot erscheint je nach Position unten rechts, links oder zentral.</p>
                      
                      {/* Simulierter Chatbot Button */}
                      <div 
                        className={`
                          fixed rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl shadow-lg cursor-pointer z-10
                          ${testConfig.position === 'bottom-right' ? 'bottom-4 right-4' : 
                            testConfig.position === 'bottom-left' ? 'bottom-4 left-4' : 
                            'bottom-4 left-1/2 transform -translate-x-1/2'}
                          ${testConfig.theme === 'blue' ? 'bg-blue-500 hover:bg-blue-600' : 
                            testConfig.theme === 'green' ? 'bg-green-500 hover:bg-green-600' : 
                            testConfig.theme === 'dark' ? 'bg-gray-700 hover:bg-gray-800' : 
                            'bg-primary hover:bg-primary/90'}
                        `}
                        onClick={() => setIsChatOpen(true)}
                      >
                        💬
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Test Results */}
              <Card className="glass mt-6">
                <CardHeader>
                  <CardTitle>📊 Konfiguration im Überblick</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Theme:</span>
                      <p className="font-medium">{testConfig.theme}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Position:</span>
                      <p className="font-medium">{testConfig.position}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Sprachgeschwindigkeit:</span>
                      <p className="font-medium">{testConfig.voiceSpeed[0]}x</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Stimmlage:</span>
                      <p className="font-medium">{testConfig.voicePitch[0]}x</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">Begrüßung:</span>
                    <p className="font-medium mt-1 p-2 bg-muted rounded">{testConfig.greeting}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Chatbot Widget */}
      {isChatOpen && (
        <SimpleChatbot
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
      
      <Footer />
    </>
  );
}