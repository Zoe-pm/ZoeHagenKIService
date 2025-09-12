import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import UeberUns from "@/pages/UeberUns";
import Kontakt from "@/pages/Kontakt";
import KundenTest from "@/pages/KundenTest";
import Impressum from "@/pages/Impressum";
import Datenschutz from "@/pages/Datenschutz";
import Bildnachweise from "@/pages/Bildnachweise";
import NotFound from "@/pages/not-found";
import Admin from "@/pages/Admin";

function Router() {
  return (
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
