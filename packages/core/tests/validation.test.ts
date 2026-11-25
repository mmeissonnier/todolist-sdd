import { describe, expect, it, vi } from "vitest";
import { TodoList } from "../src/index";

describe("title validation", () => {
  it.each([
    ["empty", ""],
    ["spaces-only", "   "],
    ["tab-only", "\t\t"],
    ["line-break-only", "\n\r\n"],
  ])("rejects an %s title without changing state or notifying", (_name, title) => {
    const list = new TodoList();
    const listener = vi.fn();
    list.subscribe(listener);
    const before = list.getSnapshot();

    expect(list.add(title)).toEqual({ ok: false, error: "EMPTY_TITLE" });
    expect(list.getSnapshot()).toBe(before);
    expect(listener).not.toHaveBeenCalled();
  });

  it("trims surrounding whitespace from a valid title", () => {
    const list = new TodoList();
    const result = list.add("  Buy milk  ");

    expect(result.ok).toBe(true);
    expect(list.getSnapshot().map((t) => t.title)).toEqual(["Buy milk"]);
  });
});
