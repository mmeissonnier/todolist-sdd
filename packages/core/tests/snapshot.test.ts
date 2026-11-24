import { describe, expect, it } from "vitest";
import { TodoList } from "../src/index";

describe("TodoList snapshot", () => {
  it("starts with an empty snapshot", () => {
    const todos = new TodoList();

    expect(todos.getSnapshot()).toEqual([]);
  });

  it("returns the same reference while the state does not change", () => {
    const todos = new TodoList();

    expect(todos.getSnapshot()).toBe(todos.getSnapshot());
  });

  it("list() returns the same value as getSnapshot()", () => {
    const todos = new TodoList();

    expect(todos.list()).toBe(todos.getSnapshot());
  });
});
