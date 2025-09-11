import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, UserX, Plus, Trash2, Send, Eye } from "lucide-react";
import { apiRequest } from '@/lib/queryClient';

// Admin login schema
const adminLoginSchema = z.object({
  password: z.string().min(1, 'Passwort ist erforderlich')
});

// Test code creation schema
const createTestCodeSchema = z.object({
  code: z.string().min(3, 'Code muss mindestens 3 Zeichen haben').transform(val => val.toUpperCase()),
  emails: z.string().min(1, 'Mindestens eine E-Mail erforderlich'),
  customerName: z.string().optional(),
  customerCompany: z.string().optional(),
  expiresInHours: z.coerce.number().min(1).max(168).default(72),
  sendEmail: z.boolean().default(false)
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;
type CreateTestCodeForm = z.infer<typeof createTestCodeSchema>;

interface TestCodeInfo {
  code: string;
  emails: string[];
  customerName?: string;
  customerCompany?: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

interface AdminSession {
  email?: string;
  expiresAt?: string;
}

export default function Admin() {
  const [adminToken, setAdminToken] = useState<string | null>(() => 
    localStorage.getItem('admin_token')
  );
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Admin login form
  const loginForm = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { password: '' }
  });

  // Test code creation form
  const testCodeForm = useForm<CreateTestCodeForm>({
    resolver: zodResolver(createTestCodeSchema),
    defaultValues: {
      code: '',
      emails: '',
      customerName: '',
      customerCompany: '',
      expiresInHours: 72,
      sendEmail: false
    }
  });

  // Admin login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: AdminLoginForm) => {
      return await apiRequest('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      if (data.success && data.token) {
        setAdminToken(data.token);
        localStorage.setItem('admin_token', data.token);
        toast({
          title: "Erfolgreich angemeldet",
          description: "Willkommen im Admin-Bereich!",
        });
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Anmeldung fehlgeschlagen",
        description: "Ungültiges Admin-Passwort",
      });
    }
  });

  // Session validation query
  const { data: sessionData } = useQuery({
    queryKey: ['admin-session'],
    queryFn: async () => {
      if (!adminToken) return null;
      return await apiRequest('/api/admin/session', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    },
    enabled: !!adminToken,
    refetchInterval: 5 * 60 * 1000, // Check every 5 minutes
    retry: false,
    onError: () => {
      handleLogout();
    }
  });

  // Test codes query
  const { data: testCodesData, isLoading: testCodesLoading } = useQuery({
    queryKey: ['admin-testcodes'],
    queryFn: async (): Promise<{ data: TestCodeInfo[] }> => {
      return await apiRequest('/api/admin/testcodes', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    },
    enabled: !!adminToken && sessionData?.valid,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Create test code mutation
  const createTestCodeMutation = useMutation({
    mutationFn: async (data: CreateTestCodeForm) => {
      const emailsArray = data.emails.split(',').map(email => email.trim()).filter(Boolean);
      return await apiRequest('/api/admin/testcodes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          ...data,
          emails: emailsArray
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testcodes'] });
      testCodeForm.reset();
      toast({
        title: "Test-Code erstellt",
        description: "Der Test-Code wurde erfolgreich erstellt.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Fehler beim Erstellen",
        description: error.message || "Test-Code konnte nicht erstellt werden",
      });
    }
  });

  // Delete test code mutation
  const deleteTestCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      return await apiRequest(`/api/admin/testcodes/${code}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testcodes'] });
      toast({
        title: "Test-Code gelöscht",
        description: "Der Test-Code wurde erfolgreich entfernt.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Fehler beim Löschen",
        description: error.message || "Test-Code konnte nicht gelöscht werden",
      });
    }
  });

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('admin_token');
    queryClient.clear();
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    });
  };

  const generateTestCode = () => {
    const timestamp = Date.now().toString().slice(-4);
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode = `ZKS-${randomCode}-${timestamp}`;
    testCodeForm.setValue('code', newCode);
  };

  const onLogin = (data: AdminLoginForm) => {
    loginMutation.mutate(data);
  };

  const onCreateTestCode = (data: CreateTestCodeForm) => {
    createTestCodeMutation.mutate(data);
  };

  const onDeleteTestCode = (code: string) => {
    if (confirm(`Test-Code "${code}" wirklich löschen?`)) {
      deleteTestCodeMutation.mutate(code);
    }
  };

  // Show login form if not authenticated
  if (!adminToken || !sessionData?.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin-Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin-Passwort</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Passwort eingeben"
                          data-testid="input-admin-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={loginMutation.isPending}
                  data-testid="button-admin-login"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Anmelden...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Anmelden
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Verwalten Sie Test-Codes und Kundenzugänge
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              data-testid="button-admin-logout"
              className="flex items-center gap-2"
            >
              <UserX className="w-4 h-4" />
              Abmelden
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Code Creation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Neuen Test-Code erstellen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...testCodeForm}>
                <form onSubmit={testCodeForm.handleSubmit(onCreateTestCode)} className="space-y-4">
                  <div className="flex gap-2">
                    <FormField
                      control={testCodeForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Test-Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ZKS-XXXX-XXXX"
                              data-testid="input-test-code"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={generateTestCode}
                        data-testid="button-generate-code"
                      >
                        Generieren
                      </Button>
                    </div>
                  </div>

                  <FormField
                    control={testCodeForm.control}
                    name="emails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail Adressen (kommagetrennt)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="user@company.de, manager@firma.de"
                            data-testid="input-test-emails"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={testCodeForm.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kundenname</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Max Mustermann"
                              data-testid="input-customer-name"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={testCodeForm.control}
                      name="customerCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Firma</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Musterfirma GmbH"
                              data-testid="input-customer-company"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <FormField
                      control={testCodeForm.control}
                      name="expiresInHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gültigkeitsdauer (Stunden)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="168"
                              data-testid="input-expires-hours"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={testCodeForm.control}
                      name="sendEmail"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 mt-8">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-send-email"
                            />
                          </FormControl>
                          <FormLabel className="text-sm">E-Mail versenden</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    disabled={createTestCodeMutation.isPending}
                    data-testid="button-create-testcode"
                  >
                    {createTestCodeMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Erstellt...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Test-Code erstellen
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Existing Test Codes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Aktive Test-Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testCodesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Lade Test-Codes...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {testCodesData?.data?.map((testCode) => (
                    <div 
                      key={testCode.code} 
                      className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm"
                      data-testid={`testcode-card-${testCode.code}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {testCode.code}
                        </code>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            testCode.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {testCode.isActive ? 'Aktiv' : 'Abgelaufen'}
                          </span>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onDeleteTestCode(testCode.code)}
                            disabled={deleteTestCodeMutation.isPending}
                            data-testid={`button-delete-${testCode.code}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {testCode.customerName && (
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {testCode.customerName}
                          {testCode.customerCompany && (
                            <span className="text-gray-500 dark:text-gray-400"> ({testCode.customerCompany})</span>
                          )}
                        </p>
                      )}
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <p><strong>E-Mails:</strong> {testCode.emails.join(', ')}</p>
                        <p><strong>Gültig bis:</strong> {new Date(testCode.expiresAt).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      Keine Test-Codes vorhanden
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}