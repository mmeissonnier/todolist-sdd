import { describe, expect, it, vi } from "vitest";
import { TodoList } from "../src/index";

function listWith(...titles: string[]) {
  const list = new TodoList();
  for (const title of titles) list.add(title);
  return list;
}

describe("TodoList.toggle", () => {
  it("flips done, and flips it back on a second toggle", () => {
    const list = listWith("Buy milk");
    const id = list.getSnapshot()[0]!.id;

    list.toggle(id);
    expect(list.getSnapshot()[0]?.done).toBe(true);

    list.toggle(id);
    expect(list.getSnapshot()[0]?.done).toBe(false);
  });

  it("keeps the other todos unchanged", () => {
    const list = listWith("A", "B", "C");
    const [a, b, c] = list.getSnapshot();

    list.toggle(b!.id);

    const [a2, b2, c2] = list.getSnapshot();
    expect(a2).toBe(a);
    expect(c2).toBe(c);
    expect(b2).toEqual({ ...b, done: true });
  });

  it("does not modify a previous snapshot", () => {
    const list = listWith("Buy milk");
    const before = list.getSnapshot();
    const todoBefore = before[0]!;

    list.toggle(todoBefore.id);

    expect(list.getSnapshot()).not.toBe(before);
    expect(before[0]).toBe(todoBefore);
    expect(todoBefore.done).toBe(false);
  });

  it("notifies listeners once per toggle", () => {
    const list = listWith("Buy milk");
    const listener = vi.fn();
    list.subscribe(listener);

    list.toggle(list.getSnapshot()[0]!.id);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("changes nothing and notifies nobody for an unknown id", () => {
    const list = listWith("Buy milk");
    const listener = vi.fn();
    list.subscribe(listener);
    const before = list.getSnapshot();

    list.toggle("does-not-exist");

    expect(list.getSnapshot()).toBe(before);
    expect(listener).not.toHaveBeenCalled();
  });
});
