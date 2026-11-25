import { describe, expect, it, vi } from "vitest";
import { TodoList } from "../src/index";

function listWith(...titles: string[]) {
  const list = new TodoList();
  for (const title of titles) list.add(title);
  return list;
}

const titles = (list: TodoList) => list.getSnapshot().map((todo) => todo.title);

describe("TodoList.remove", () => {
  it("removes only the matching todo and keeps the order of the others", () => {
    const list = listWith("A", "B", "C");
    const b = list.getSnapshot()[1]!;

    list.remove(b.id);

    expect(titles(list)).toEqual(["A", "C"]);
  });

  it("removes a done todo the same way", () => {
    const list = listWith("A", "B");
    const a = list.getSnapshot()[0]!;
    list.toggle(a.id);

    list.remove(a.id);

    expect(titles(list)).toEqual(["B"]);
  });

  it("gives an empty snapshot after removing the last todo", () => {
    const list = listWith("A");

    list.remove(list.getSnapshot()[0]!.id);

    expect(list.getSnapshot()).toEqual([]);
  });

  it("notifies listeners once per removal", () => {
    const list = listWith("A", "B");
    const listener = vi.fn();
    list.subscribe(listener);

    list.remove(list.getSnapshot()[0]!.id);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("changes nothing and notifies nobody for an unknown id", () => {
    const list = listWith("A");
    const listener = vi.fn();
    list.subscribe(listener);
    const before = list.getSnapshot();

    list.remove("does-not-exist");

    expect(list.getSnapshot()).toBe(before);
    expect(listener).not.toHaveBeenCalled();
  });

  it("ends a mixed sequence with the added, not removed todos in their latest state", () => {
    const list = new TodoList();
    const results = ["A", "B", "C", "D"].map((title) => list.add(title));
    const [a, b, c] = results.map((r) => (r.ok ? r.todo.id : ""));

    list.toggle(a!);
    list.remove(b!);
    list.toggle(c!);
    list.toggle(a!);
    list.remove(c!);
    list.add("E");

    expect(list.getSnapshot().map(({ title, done }) => ({ title, done }))).toEqual([
      { title: "A", done: false },
      { title: "D", done: false },
      { title: "E", done: false },
    ]);
  });
});
