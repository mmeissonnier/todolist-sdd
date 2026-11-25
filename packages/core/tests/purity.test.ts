import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const packageRoot = join(import.meta.dirname, "..");
const srcDir = join(packageRoot, "src");

describe("core purity (constitution principle II)", () => {
  it("has no runtime dependency", () => {
    const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));

    expect(pkg.dependencies ?? {}).toEqual({});
    expect(pkg.peerDependencies ?? {}).toEqual({});
  });

  it("imports only relative modules in src", () => {
    const specifiers: string[] = [];
    for (const file of readdirSync(srcDir, { recursive: true, encoding: "utf8" })) {
      if (!/\.tsx?$/.test(file)) continue;
      const source = readFileSync(join(srcDir, file), "utf8");
      for (const match of source.matchAll(
        /(?:import|export)\s[^'"]*?from\s*["']([^"']+)["']|import\s*["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g,
      )) {
        specifiers.push((match[1] ?? match[2] ?? match[3])!);
      }
    }

    expect(specifiers.length).toBeGreaterThan(0);
    expect(specifiers.filter((s) => !s.startsWith("./") && !s.startsWith("../"))).toEqual([]);
  });
});
