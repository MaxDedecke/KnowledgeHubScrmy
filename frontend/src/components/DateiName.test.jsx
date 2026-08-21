import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import DateiName from "./DateiName.jsx";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("DateiName", () => {
  it("zeigt einen kurzen Namen unverändert und ohne eigene Tooltip-Zuschrift", () => {
    const { container } = render(<DateiName name="vertrag.pdf" />);

    expect(screen.getByText("vertrag.pdf")).toBeTruthy();
    // Ohne withTooltip kein Radix-Tooltip-Portal im DOM.
    expect(
      container.querySelector('[data-radix-popper-content-wrapper]')
    ).toBeNull();
  });

  it("kürzt einen langen Namen per Truncate (Tailwind-Klasse)", () => {
    render(<DateiName name="ein-sehr-langer-dateiname-ohne-ende.pdf" />);
    const text = screen.getByText("ein-sehr-langer-dateiname-ohne-ende.pdf");
    expect(text.className).toContain("truncate");
  });

  it("zeigt bei withTooltip den vollständigen Namen als Tooltip-Inhalt", async () => {
    const name = "sehr-langer-dateiname-fuer-tooltip-pruefung.pdf";
    render(<DateiName name={name} withTooltip />);

    // Ohne onFormen zeigt der Trigger den Namen; das Portal entsteht erst
    // beim Fokussieren/Überfahren über den Radix-Trigger.
    fireEvent.focus(screen.getByText(name));

    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toBeTruthy();
    expect(tooltip.textContent).toBe(name);
  });
});
