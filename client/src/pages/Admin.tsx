import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface TestAccount {
  testCode: string;
  allowedEmails: string[];
  customerName?: string;
  customerCompany?: string;
}

export default function Admin() {
  const [accounts, setAccounts] = useState<TestAccount[]>([]);
  const [newAccount, setNewAccount] = useState({
    testCode: '',
    emails: '',
    customerName: '',
    customerCompany: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load existing test accounts from storage
    loadTestAccounts();
  }, []);

  const loadTestAccounts = () => {
    // Simulated data - in real implementation, this would come from backend
    const sampleAccounts: TestAccount[] = [
      {
        testCode: 'ZKS-DEMO-2024',
        allowedEmails: ['demo@kunde.de', 'test@unternehmen.de'],
        customerName: 'Demo Kunde',
        customerCompany: 'Demo-Unternehmen'
      },
      {
        testCode: 'ZKS-TEST-2024',
        allowedEmails: ['kunde@firma.de', 'user@company.de'],
        customerName: 'Max Mustermann',
        customerCompany: 'Musterfirma GmbH'
      },
      {
        testCode: 'ZKS-PREVIEW-2024',
        allowedEmails: ['manager@startup.de', 'info@business.de'],
        customerName: 'Anna Schmidt',
        customerCompany: 'Startup Solutions'
      }
    ];
    setAccounts(sampleAccounts);
  };

  const generateTestCode = () => {
    const year = new Date().getFullYear();
    const randomId = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `ZKS-${randomId}-${year}`;
  };

  const addTestAccount = () => {
    if (!newAccount.testCode || !newAccount.emails) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Testcode und E-Mail-Adressen sind erforderlich."
      });
      return;
    }

    const emailList = newAccount.emails
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(email => email.length > 0);

    if (emailList.length === 0) {
      toast({
        variant: "destructive", 
        title: "Fehler",
        description: "Mindestens eine gültige E-Mail-Adresse ist erforderlich."
      });
      return;
    }

    const testAccount: TestAccount = {
      testCode: newAccount.testCode.toUpperCase(),
      allowedEmails: emailList,
      customerName: newAccount.customerName || undefined,
      customerCompany: newAccount.customerCompany || undefined
    };

    setAccounts([...accounts, testAccount]);
    setNewAccount({ testCode: '', emails: '', customerName: '', customerCompany: '' });
    
    toast({
      title: "Erfolg",
      description: `Testcode ${testAccount.testCode} erfolgreich erstellt!`
    });
  };

  const removeTestAccount = (testCode: string) => {
    setAccounts(accounts.filter(account => account.testCode !== testCode));
    toast({
      title: "Entfernt",
      description: `Testcode ${testCode} wurde entfernt.`
    });
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">🔧 Admin-Panel: Testcode-Verwaltung</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Testcodes und Kundenzuordnungen für die Testumgebung.
          </p>
        </div>

        {/* Neuen Testcode hinzufügen */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>➕ Neuen Testcode erstellen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testCode">Testcode</Label>
                <div className="flex gap-2">
                  <Input
                    id="testCode"
                    value={newAccount.testCode}
                    onChange={(e) => setNewAccount({...newAccount, testCode: e.target.value})}
                    placeholder="ZKS-KUNDE-2024"
                    data-testid="input-testcode"
                  />
                  <Button 
                    onClick={() => setNewAccount({...newAccount, testCode: generateTestCode()})}
                    variant="outline"
                    data-testid="button-generate-code"
                  >
                    🎲 Generieren
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="emails">E-Mail-Adressen (kommagetrennt)</Label>
                <Input
                  id="emails"
                  value={newAccount.emails}
                  onChange={(e) => setNewAccount({...newAccount, emails: e.target.value})}
                  placeholder="kunde@firma.de, user@company.de"
                  data-testid="input-emails"
                />
              </div>
              <div>
                <Label htmlFor="customerName">Kundenname (optional)</Label>
                <Input
                  id="customerName"
                  value={newAccount.customerName}
                  onChange={(e) => setNewAccount({...newAccount, customerName: e.target.value})}
                  placeholder="Max Mustermann"
                  data-testid="input-customer-name"
                />
              </div>
              <div>
                <Label htmlFor="customerCompany">Unternehmen (optional)</Label>
                <Input
                  id="customerCompany"
                  value={newAccount.customerCompany}
                  onChange={(e) => setNewAccount({...newAccount, customerCompany: e.target.value})}
                  placeholder="Musterfirma GmbH"
                  data-testid="input-customer-company"
                />
              </div>
            </div>
            <Button 
              onClick={addTestAccount}
              className="button-gradient"
              data-testid="button-add-account"
            >
              ✅ Testcode erstellen
            </Button>
          </CardContent>
        </Card>

        {/* Bestehende Testcodes */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Bestehende Testcodes ({accounts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.map((account, index) => (
                <div 
                  key={account.testCode}
                  className="p-4 border rounded-lg bg-muted/20"
                  data-testid={`account-${index}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono bg-primary/10 px-2 py-1 rounded text-sm font-semibold">
                          {account.testCode}
                        </span>
                        {account.customerName && (
                          <span className="text-sm text-muted-foreground">
                            • {account.customerName}
                          </span>
                        )}
                        {account.customerCompany && (
                          <span className="text-sm text-muted-foreground">
                            ({account.customerCompany})
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong>Erlaubte E-Mails:</strong> {account.allowedEmails.join(', ')}
                      </div>
                    </div>
                    <Button
                      onClick={() => removeTestAccount(account.testCode)}
                      variant="destructive"
                      size="sm"
                      data-testid={`button-remove-${index}`}
                    >
                      🗑️ Entfernen
                    </Button>
                  </div>
                </div>
              ))}
              {accounts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Keine Testcodes vorhanden. Erstellen Sie den ersten Testcode oben.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Anleitung */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📖 Anleitung zur Kundenverwaltung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold">1. Testcode generieren</h4>
              <p className="text-sm text-muted-foreground">
                Erstellen Sie für jeden Kunden einen eindeutigen Testcode nach dem Schema ZKS-XXXXX-YEAR.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">2. E-Mail-Adressen zuordnen</h4>
              <p className="text-sm text-muted-foreground">
                Geben Sie alle E-Mail-Adressen an, die mit diesem Testcode Zugang haben sollen (kommagetrennt).
              </p>
            </div>
            <div>
              <h4 className="font-semibold">3. Kunde freischalten</h4>
              <p className="text-sm text-muted-foreground">
                Teilen Sie dem Kunden den Testcode und die registrierte E-Mail-Adresse mit. Nur diese Kombination gewährt Zugang.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">4. Überwachung</h4>
              <p className="text-sm text-muted-foreground">
                Alle Login-Versuche werden protokolliert. Sie erhalten automatisch E-Mail-Benachrichtigungen bei neuen Anmeldungen.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}