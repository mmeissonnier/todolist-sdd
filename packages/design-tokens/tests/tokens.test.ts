import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const src = resolve(import.meta.dirname, "../src");
const read = (file: string) =>
  existsSync(resolve(src, file)) ? readFileSync(resolve(src, file), "utf8") : "";

const COLORS = [
  "base-100",
  "base-200",
  "base-300",
  "base-content",
  "primary",
  "primary-content",
  "error",
  "success",
];
const THEME_VARS = [
  ...COLORS.map((name) => `--color-${name}`),
  "--radius-field",
  "--radius-box",
];
const THEME_BLOCK_VARS = [
  "--font-sans",
  "--text-sm",
  "--text-base",
  "--text-lg",
  "--text-2xl",
  "--container-app",
];

const count = (haystack: string, needle: string) =>
  haystack.split(new RegExp(`${needle}\\s*:`)).length - 1;

describe("tokens.css", () => {
  const css = read("tokens.css");

  it("exists", () => {
    expect(css).not.toBe("");
  });

  it("declares one default light DaisyUI theme", () => {
    expect(css.match(/@plugin\s+"daisyui\/theme"/g)).toHaveLength(1);
    expect(css).toMatch(/default:\s*true/);
    expect(css).toMatch(/color-scheme:\s*light/);
  });

  it.each([...THEME_VARS, ...THEME_BLOCK_VARS])("defines %s exactly once", (name) => {
    expect(count(css, name)).toBe(1);
  });
});

describe("base.css", () => {
  const css = read("base.css");

  it("exists", () => {
    expect(css).not.toBe("");
  });

  it("has no raw color literal", () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(/);
  });
});
