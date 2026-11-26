import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const src = resolve(import.meta.dirname, "../src");
const read = (file: string) =>
  existsSync(resolve(src, file)) ? readFileSync(resolve(src, file), "utf8") : "";

// Lengths allowed outside tokens: border widths and focus outline offsets.
const ALLOWED_LENGTHS = ["1px"];

// Class names per unit, from specs/003-common-frontend-styles/contracts/class-contract.md
const UNITS: Record<string, string[]> = {
  "todo-form": ["todo-form", "todo-form-input", "todo-form-submit", "todo-form-error"],
  "todo-list": ["todo-list"],
  "todo-item": ["todo", "todo-check", "todo-title", "todo-delete"],
  "todo-empty": ["todo-empty"],
};

function withoutAllowedLengths(css: string): string {
  return ALLOWED_LENGTHS.reduce((acc, value) => acc.split(value).join(""), css);
}

describe.each(Object.entries(UNITS))("components/%s.css", (unit, classes) => {
  const file = `components/${unit}.css`;
  const css = read(file);

  it("exists", () => {
    expect(css).not.toBe("");
  });

  it("is imported by styles.css", () => {
    expect(read("styles.css")).toContain(`./components/${unit}.css`);
  });

  it("has no raw color literal", () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(/);
  });

  it("has no raw length other than 0 or allowed exceptions", () => {
    expect(withoutAllowedLengths(css)).not.toMatch(/(?<![\w-])\d*\.?\d+(px|rem|em)\b/);
  });

  it.each(classes)("defines .%s", (name) => {
    expect(css).toMatch(new RegExp(`\\.${name}(?![\\w-])`));
  });
});
