import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App.jsx";

describe("App", () => {
  it("rendert die responsive Grundfläche mit Titel", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Knowledge Hub" })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 2, name: /Willkommen im Knowledge Hub/ })
    ).toBeTruthy();
  });
});
