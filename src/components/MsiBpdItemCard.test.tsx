import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { MsiBpdItemCard } from "@/components/MsiBpdItemCard";
import type { MsiBpdItem } from "@/types/msibpd";

const item: MsiBpdItem = {
  id: 1,
  question: "Have you had relationships that switched between idealization and devaluation?",
  questionMl: "ആദർശവൽക്കരണത്തിനും അവമൂല്യനത്തിനും ഇടയിൽ മാറിമറിഞ്ഞ ബന്ധങ്ങൾ നിങ്ങൾക്ക് ഉണ്ടായിട്ടുണ്ടോ?",
};

const Toggle: React.FC = () => {
  const { setLanguage } = useLanguage();
  return <button onClick={() => setLanguage("ml")}>switch-ml</button>;
};

describe("Component-level translation gating (MsiBpdItemCard)", () => {
  it("shows English question and Yes/No by default", () => {
    render(
      <LanguageProvider>
        <MsiBpdItemCard item={item} onResponse={() => {}} />
      </LanguageProvider>
    );

    expect(screen.getByText(item.question)).toBeInTheDocument();
    expect(screen.queryByText(item.questionMl)).not.toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    // No Malayalam yes/no
    expect(screen.queryByText("അതെ")).not.toBeInTheDocument();
    expect(screen.queryByText("ഇല്ല")).not.toBeInTheDocument();
  });

  it("only shows Malayalam after the language toggle is activated", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Toggle />
        <MsiBpdItemCard item={item} onResponse={() => {}} />
      </LanguageProvider>
    );

    // Pre-toggle: English only
    expect(screen.getByText(item.question)).toBeInTheDocument();
    expect(screen.queryByText(item.questionMl)).not.toBeInTheDocument();

    await user.click(screen.getByText("switch-ml"));

    // Post-toggle: Malayalam content visible, English clinical question gone
    expect(screen.getByText(item.questionMl)).toBeInTheDocument();
    expect(screen.queryByText(item.question)).not.toBeInTheDocument();
    expect(screen.getByText("അതെ")).toBeInTheDocument();
    expect(screen.getByText("ഇല്ല")).toBeInTheDocument();
  });
});
