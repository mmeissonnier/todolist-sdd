import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appsDir = resolve(import.meta.dirname, "../../../apps");
const IMPORT = '@import "@todolist/design-tokens/styles.css";';

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}

const apps = readdirSync(appsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

describe.each(apps)("apps/%s", (app) => {
  const files = walk(join(appsDir, app, "src"));

  it("has a single stylesheet containing only the shared import", () => {
    const stylesheets = files.filter((file) => file.endsWith(".css"));
    expect(stylesheets).toHaveLength(1);
    expect(readFileSync(stylesheets[0]!, "utf8").trim()).toBe(IMPORT);
  });

  it("has no inline style block or style attribute", () => {
    for (const file of files.filter((f) => /\.(vue|tsx|ts)$/.test(f))) {
      const content = readFileSync(file, "utf8");
      expect(content, file).not.toMatch(/<style[\s>]/);
      expect(content, file).not.toMatch(/\sstyle=/);
    }
  });
});
