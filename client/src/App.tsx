import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";

// Eager load: Critical marketing pages
import Home from "@/pages/Home";

// Lazy load: Secondary and admin pages for better performance
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const UeberUns = lazy(() => import("@/pages/UeberUns"));
const Kontakt = lazy(() => import("@/pages/Kontakt"));
const KundenTest = lazy(() => import("@/pages/KundenTest"));
const Impressum = lazy(() => import("@/pages/Impressum"));
const Datenschutz = lazy(() => import("@/pages/Datenschutz"));
const Bildnachweise = lazy(() => import("@/pages/Bildnachweise"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Admin = lazy(() => import("@/pages/Admin"));

function Router() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg text-muted-foreground">Lädt...</div>
      </div>
    }>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/produkte/:id" component={ProductDetail} />
        <Route path="/ueber-uns" component={UeberUns} />
        <Route path="/kontakt" component={Kontakt} />
        <Route path="/test" component={KundenTest} />
        <Route path="/kundentest">
          {() => {
            // SPA-friendly redirect to new route
            if (typeof window !== 'undefined') {
              window.history.replaceState(null, '', '/test');
            }
            return <Route path="/test" component={KundenTest} />;
          }}
        </Route>
        <Route path="/impressum" component={Impressum} />
        <Route path="/datenschutz" component={Datenschutz} />
        <Route path="/bildnachweise" component={Bildnachweise} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
