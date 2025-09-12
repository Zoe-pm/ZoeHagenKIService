// SendGrid Integration für Test-Code E-Mail Versendung
// Referenz zur javascript_sendgrid integration
import { MailService } from '@sendgrid/mail';

// SendGrid Service - sichere Initialisierung ohne Crash
let mailService: MailService | null = null;

function initializeMailService(): boolean {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.warn("SENDGRID_API_KEY nicht konfiguriert - E-Mail-Versendung nicht verfügbar");
      return false;
    }
    
    mailService = new MailService();
    mailService.setApiKey(apiKey);
    return true;
  } catch (error) {
    console.error("SendGrid Initialisierung fehlgeschlagen:", error);
    return false;
  }
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

interface TestCodeEmailData {
  customerName: string;
  customerEmail: string;
  testCode: string;
  validUntil: string;
  loginUrl: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    if (!mailService && !initializeMailService()) {
      console.error("SendGrid nicht verfügbar - E-Mail kann nicht gesendet werden");
      return false;
    }

    const emailData: any = {
      to: params.to,
      from: params.from || 'noreply@zoeskiservice.de', // Fallback FROM-Adresse
      subject: params.subject,
    };
    
    if (params.text) emailData.text = params.text;
    if (params.html) emailData.html = params.html;
    
    await mailService!.send(emailData);
    console.log(`Email sent successfully to: ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendTestCodeEmail(data: TestCodeEmailData): Promise<boolean> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0ea5e9, #ec4899); padding: 2px; border-radius: 12px;">
      <div style="background: white; padding: 30px; border-radius: 10px; margin: 2px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="background: linear-gradient(135deg, #0ea5e9, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; font-size: 28px;">
            Zoë's KI Service
          </h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Ihr persönlicher Test-Zugang</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f0f9ff, #fdf2f8); padding: 25px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #1f2937; margin-top: 0;">🎉 Willkommen ${data.customerName}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Ihr persönlicher Test-Zugang für unsere KI-Assistenten ist jetzt bereit. 
            Entdecken Sie alle Features und konfigurieren Sie Ihren perfekten KI-Assistenten.
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">🔐 Ihre Zugangsdaten:</h3>
          <div style="background: white; padding: 15px; border-radius: 6px; margin: 10px 0; border: 2px dashed #e5e7eb;">
            <p style="margin: 5px 0; color: #374151;"><strong>Test-Code:</strong> <span style="font-family: monospace; font-size: 18px; color: #0ea5e9; font-weight: bold;">${data.testCode}</span></p>
            <p style="margin: 5px 0; color: #374151;"><strong>E-Mail:</strong> ${data.customerEmail}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Gültig bis:</strong> ${data.validUntil}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.loginUrl}" 
             style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #ec4899); 
                    color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; 
                    font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px 0 rgba(14, 165, 233, 0.3);">
            🚀 Jetzt testen
          </a>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">📋 Was Sie testen können:</h3>
          <ul style="color: #92400e; margin: 0; padding-left: 20px;">
            <li><strong>Chatbot:</strong> Intelligente Textkonversationen</li>
            <li><strong>Voicebot:</strong> Natürliche Sprachinteraktion</li>
            <li><strong>Konfiguration:</strong> Farben, Texte, Position anpassen</li>
            <li><strong>Integration:</strong> Vorschau für Ihre Website</li>
          </ul>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Bei Fragen erreichen Sie mich unter:</p>
          <p><strong>📞 +49 171 9862773</strong> | <strong>📧 zoe-kiconsulting@pm.me</strong></p>
          <p style="margin-top: 15px;">
            <em>Zoë Hagen - Gründerin Zoë's KI Service</em>
          </p>
        </div>
      </div>
    </div>
  `;

  const textContent = `
Willkommen bei Zoë's KI Service!

Hallo ${data.customerName},

Ihr persönlicher Test-Zugang ist bereit!

Zugangsdaten:
- Test-Code: ${data.testCode}
- E-Mail: ${data.customerEmail} 
- Gültig bis: ${data.validUntil}

Jetzt testen: ${data.loginUrl}

Was Sie testen können:
✓ Chatbot: Intelligente Textkonversationen
✓ Voicebot: Natürliche Sprachinteraktion  
✓ Konfiguration: Farben, Texte, Position anpassen
✓ Integration: Vorschau für Ihre Website

Bei Fragen:
📞 +49 171 9862773
📧 zoe-kiconsulting@pm.me

Viel Spaß beim Testen!
Zoë Hagen - Gründerin Zoë's KI Service
  `;

  return await sendEmail({
    to: data.customerEmail,
    from: "zoe-kiconsulting@pm.me", // Ihre verifizierte SendGrid E-Mail
    subject: `🎉 Ihr KI-Test Zugang ist bereit: ${data.testCode}`,
    text: textContent,
    html: htmlContent
  });
}