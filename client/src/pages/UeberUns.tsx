import SEOHelmet from "@/components/SEOHelmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function UeberUns() {
  return (
    <>
      <SEOHelmet 
        title="Über uns – Zoë Hagen KI Consulting"
        description="KI mit Herz & Hirn: Wir kombinieren klare Umsetzung mit verlässlichem Support – von schnellen Chatbots bis zu Wissenslösungen für Unternehmen."
        keywords="Zoë Hagen, KI Consulting, Über uns, Team, Gründerin"
      />
      
      <Navigation />
      
      <main className="bg-[#FCFCFD] text-[#1B1F23] min-h-screen pt-20">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-10 pb-8" data-testid="hero-section">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-[#EEF1F4]">
              <img
                src="/images/zoe.jpg"
                alt="Zoë Hagen, Gründerin, Portrait im Büro"
                className="w-full h-full object-cover"
                loading="eager"
                data-testid="zoe-portrait"
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight" data-testid="main-title">
                KI mit Herz & Hirn – von Menschen für Menschen
              </h1>
              <p className="mt-4 text-base text-[#4B5563]" data-testid="intro-text">
                Ich bin Zoë Hagen, Gründerin von Zoë Hagen KI Consulting und der KI Toolbox.
                Meine Mission: KI so gestalten, dass sie Unternehmen entlastet, Abläufe vereinfacht
                und Menschen mehr Freiraum gibt – verständlich, sicher und persönlich.
              </p>
              <div className="mt-6">
                <a
                  href="/#kontakt"
                  role="button"
                  className="inline-flex items-center rounded-md bg-[#B8436A] px-5 py-3 text-white hover:opacity-90 transition-opacity"
                  data-testid="contact-cta"
                >
                  Jetzt Kontakt aufnehmen
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Wer wir sind */}
        <section className="mx-auto max-w-6xl px-4 py-6" data-testid="who-we-are-section">
          <h2 className="text-xl md:text-2xl font-semibold">Wer hinter der KI Toolbox steht</h2>
          <p className="mt-3 text-[#4B5563]">
            Ich verbinde klare Umsetzung mit einem systemischen Blick auf Prozesse und Menschen.
            Ziel ist immer ein Service, der sich leicht anfühlt und verlässlich funktioniert – ohne Hürden
            und ohne Fachsprache. Lösungen sollen im Alltag helfen, nicht beschäftigen.
          </p>
        </section>

        {/* Team / Netzwerk */}
        <section className="mx-auto max-w-6xl px-4 py-6" data-testid="team-section">
          <h2 className="text-xl md:text-2xl font-semibold">Ein starkes Team an meiner Seite</h2>
          <p className="mt-3 text-[#4B5563]">
            Für jedes Projekt stelle ich das passende Team zusammen: erfahrene Webdesigner für moderne
            Websites mit KI-Integration, mein Netzwerk rund um AICONIQ für agentische KI-Lösungen sowie
            Spezialisten für Automatisierung und Datenschutz. So liefern wir schnelle Ergebnisse bei kleinen
            Vorhaben und bleiben auch bei größeren Umsetzungen zuverlässig.
          </p>
        </section>

        {/* Werte / Anspruch */}
        <section className="mx-auto max-w-6xl px-4 py-6" data-testid="values-section">
          <h2 className="text-xl md:text-2xl font-semibold">Unser Anspruch</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-[#4B5563]">
            <li className="rounded-md border border-[#EEF1F4] bg-white px-4 py-3" data-testid="value-personal">
              Persönlich & nahbar – Zusammenarbeit auf Augenhöhe
            </li>
            <li className="rounded-md border border-[#EEF1F4] bg-white px-4 py-3" data-testid="value-clear">
              Klar & verständlich – keine Fachsprache, keine Hürden
            </li>
            <li className="rounded-md border border-[#EEF1F4] bg-white px-4 py-3" data-testid="value-innovative">
              Innovativ & zuverlässig – sofort nutzbar und nachhaltig
            </li>
            <li className="rounded-md border border-[#EEF1F4] bg-white px-4 py-3" data-testid="value-gdpr">
              DSGVO-konform – Sicherheit und Datenschutz zuerst
            </li>
          </ul>
        </section>

        {/* Abschluss-CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-10" data-testid="final-cta-section">
          <div className="rounded-lg border border-[#EEF1F4] bg-white p-6 md:p-8">
            <p className="text-base text-[#4B5563]">
              Ob Chatbot, Voicebot, Avatar oder Wissenslösung: Wir begleiten Sie von der Idee
              bis zur Umsetzung – und bleiben als Partner an Ihrer Seite.
            </p>
            <div className="mt-5">
              <a
                href="/#kontakt"
                role="button"
                className="inline-flex items-center rounded-md border border-[#D8DEE4] px-5 py-3 hover:border-[#2596BE] transition-colors"
                data-testid="consultation-cta"
              >
                Erstgespräch vereinbaren
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}