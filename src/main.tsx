import { createRoot } from "react-dom/client";
import { LanguageProvider } from './contexts/LanguageContext';
import App from "./App.tsx";
import "./index.css";
import "./styles/dark-mode.css";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
