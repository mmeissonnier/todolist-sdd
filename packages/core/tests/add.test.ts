import { describe, expect, it, vi } from "vitest";
import { TodoList } from "../src/index";

describe("TodoList.add", () => {
  it("appends a todo that is not done and returns it", () => {
    const todos = new TodoList();

    const result = todos.add("Buy milk");

    expect(result).toEqual({
      ok: true,
      todo: { id: expect.any(String), title: "Buy milk", done: false },
    });
    expect(todos.list()).toEqual([
      { id: expect.any(String), title: "Buy milk", done: false },
    ]);
  });

  it("gives distinct ids to todos with the same title", () => {
    const todos = new TodoList();

    todos.add("Buy milk");
    todos.add("Buy milk");

    const [first, second] = todos.list();
    expect(first?.id).not.toBe(second?.id);
  });

  it("keeps todos in the order they were added", () => {
    const todos = new TodoList();

    todos.add("First");
    todos.add("Second");
    todos.add("Third");

    expect(todos.list().map((todo) => todo.title)).toEqual([
      "First",
      "Second",
      "Third",
    ]);
  });

  it("notifies listeners once per add", () => {
    const todos = new TodoList();
    const listener = vi.fn();
    todos.subscribe(listener);

    todos.add("Buy milk");
    expect(listener).toHaveBeenCalledTimes(1);

    todos.add("Walk the dog");
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("returns a new snapshot reference after each add and keeps the previous one intact", () => {
    const todos = new TodoList();
    const before = todos.getSnapshot();

    todos.add("Buy milk");
    const after = todos.getSnapshot();

    expect(after).not.toBe(before);
    expect(before).toEqual([]);
    expect(todos.getSnapshot()).toBe(after);
  });

  it("keeps state and listeners independent between two instances", () => {
    const first = new TodoList();
    const second = new TodoList();
    const firstListener = vi.fn();
    const secondListener = vi.fn();
    first.subscribe(firstListener);
    second.subscribe(secondListener);

    first.add("Only in the first list");

    expect(first.list()).toHaveLength(1);
    expect(second.list()).toHaveLength(0);
    expect(firstListener).toHaveBeenCalledTimes(1);
    expect(secondListener).not.toHaveBeenCalled();
  });

  it("stops notifying a listener once it has unsubscribed", () => {
    const todos = new TodoList();
    const listener = vi.fn();
    const unsubscribe = todos.subscribe(listener);

    todos.add("Before");
    unsubscribe();
    todos.add("After");

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
