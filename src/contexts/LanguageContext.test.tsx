import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import {
  LanguageProvider,
  useLanguage,
} from "@/contexts/LanguageContext";

// Probe component to expose context state in the DOM
const Probe: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="nav-prev">{t("nav.previous")}</span>
      <span data-testid="yes">{t("yes")}</span>
      <button onClick={() => setLanguage("ml")}>to-ml</button>
      <button onClick={() => setLanguage("en")}>to-en-2</button>
      <button onClick={() => setLanguage("en")}>to-en</button>
    </div>
  );
};

const renderProbe = () =>
  render(
    <LanguageProvider>
      <Probe />
    </LanguageProvider>
  );

describe("LanguageContext default + toggle behavior", () => {
  it("defaults to English on first mount", () => {
    renderProbe();
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    // English clinical strings should be present
    expect(screen.getByTestId("nav-prev")).toHaveTextContent("Previous");
    expect(screen.getByTestId("yes")).toHaveTextContent("Yes");
  });

  it("does NOT render Malayalam strings before toggle", () => {
    renderProbe();
    // Malayalam translations for these keys
    expect(screen.queryByText("മുമ്പത്തേത്")).not.toBeInTheDocument();
    expect(screen.queryByText("അതെ")).not.toBeInTheDocument();
  });

  it("renders Malayalam strings only after toggling to ml", async () => {
    const user = userEvent.setup();
    renderProbe();

    // Sanity: still English
    expect(screen.getByTestId("nav-prev")).toHaveTextContent("Previous");

    await user.click(screen.getByText("to-ml"));

    expect(screen.getByTestId("lang")).toHaveTextContent("ml");
    expect(screen.getByTestId("nav-prev")).toHaveTextContent("മുമ്പത്തേത്");
    expect(screen.getByTestId("yes")).toHaveTextContent("അതെ");
  });

  it("returns to English when toggled back", async () => {
    const user = userEvent.setup();
    renderProbe();
    await user.click(screen.getByText("to-ml"));
    await user.click(screen.getByText("to-en"));
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(screen.getByTestId("nav-prev")).toHaveTextContent("Previous");
    expect(screen.queryByText("മുമ്പത്തേത്")).not.toBeInTheDocument();
  });

  it('only exposes English and Malayalam in LANGUAGES', async () => {
    const { LANGUAGES } = await import('@/contexts/LanguageContext');
    expect(LANGUAGES.map((l) => l.code).sort()).toEqual(['en', 'ml']);
  });

  it("each fresh provider mount re-defaults to English", () => {
    const { unmount } = renderProbe();
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    unmount();
    renderProbe();
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
  });
});
