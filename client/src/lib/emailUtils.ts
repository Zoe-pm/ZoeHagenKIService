// E-Mail Obfuskation utility functions to prevent harvesting/phishing

interface EmailParts {
  user: string;
  domain: string;
}

/**
 * Obfuskiert eine E-Mail-Adresse durch Aufteilen und Base64-Kodierung
 */
function obfuscateEmail(email: string): EmailParts {
  const [user, domain] = email.split('@');
  return {
    user: btoa(user),
    domain: btoa(domain)
  };
}

/**
 * Rekonstruiert eine E-Mail-Adresse aus obfuskierten Teilen
 */
function deobfuscateEmail(parts: EmailParts): string {
  const user = atob(parts.user);
  const domain = atob(parts.domain);
  return `${user}@${domain}`;
}

/**
 * Erstellt einen sicheren mailto-Link mit obfuskierter E-Mail
 */
export function createSecureMailtoLink(userEncoded: string, domainEncoded: string, subject?: string): string {
  const email = deobfuscateEmail({ user: userEncoded, domain: domainEncoded });
  const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${email}${subjectParam}`;
}

/**
 * Zeigt eine obfuskierte E-Mail-Adresse an (für Display-Zwecke)
 */
export function displayObfuscatedEmail(userEncoded: string, domainEncoded: string): string {
  return deobfuscateEmail({ user: userEncoded, domain: domainEncoded });
}

/**
 * Hook für sichere E-Mail-Verlinkung
 */
export function useSecureEmail(email: string) {
  const { user, domain } = obfuscateEmail(email);
  
  const handleEmailClick = (subject?: string) => {
    const link = createSecureMailtoLink(user, domain, subject);
    window.open(link, '_blank');
  };

  const displayEmail = displayObfuscatedEmail(user, domain);
  
  return {
    handleEmailClick,
    displayEmail,
    userEncoded: user,
    domainEncoded: domain
  };
}

// Vordefinierte obfuskierte E-Mail-Adressen
export const SECURE_EMAILS = {
  main: {
    userEncoded: btoa('zoe-kiconsulting'),
    domainEncoded: btoa('pm.me')
  },
  alternative: {
    userEncoded: btoa('zoehagenkiconsulting'), 
    domainEncoded: btoa('pm.me')
  }
};