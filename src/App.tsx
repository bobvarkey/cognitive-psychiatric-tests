import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PatientInfoProvider } from "@/contexts/PatientInfoContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import CategoryBrowser from "./pages/CategoryBrowser";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { NavigationButtons } from "@/components/NavigationButtons";
import { useEffect } from "react";
import { useThemeStore } from "@/hooks/useThemeStore";

const queryClient = new QueryClient();

const ThemeInitializer = () => {
  const { mode, theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    root.classList.remove("light", "dark");
    root.classList.add(mode);

    body.classList.remove("theme-sunset", "theme-midnight", "theme-forest");
    body.classList.add(`theme-${theme}`);
  }, [mode, theme]);

  return null;
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeInitializer />
    <TooltipProvider>
      <SubscriptionProvider>
        <LanguageProvider>
          <PatientInfoProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/history" element={<Index />} />
                <Route path="/settings" element={<Index />} />
                <Route path="/glossary" element={<Index />} />
                <Route path="/category/:category" element={<CategoryBrowser />} />
                <Route path="/assessment/:id" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <NavigationButtons />
            </BrowserRouter>
          </PatientInfoProvider>
        </LanguageProvider>
      </SubscriptionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
