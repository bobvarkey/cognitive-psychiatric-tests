import { createRoot } from "react-dom/client";
import { LanguageProvider } from './contexts/LanguageContext';
import App from "./App.tsx";
import "./index.css";
import "./styles/dark-mode.css";
import { migrateLegacyPatientData } from "./lib/db";

// One-time: encrypt/strip plaintext patient identifiers and wipe legacy drafts.
migrateLegacyPatientData().catch(() => { /* best effort; never block app start */ });

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
