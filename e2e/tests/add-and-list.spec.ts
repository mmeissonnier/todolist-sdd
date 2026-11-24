import { expect, test } from "@playwright/test";

// Elements are located only through the accessible names in
// specs/001-basic-todo-list/contracts/ui-contract.md, so this suite runs
// unchanged against every app.

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

async function addTodo(page: import("@playwright/test").Page, title: string) {
  await page.getByRole("textbox", { name: "New todo title" }).fill(title);
  await page.getByRole("button", { name: "Add" }).click();
}

test("starts with an empty list and an empty-state message", async ({ page }) => {
  await expect(page.getByRole("status")).toHaveText("No todos yet");
  await expect(page.getByRole("list", { name: "Todos" })).toHaveCount(0);
});

test("shows a todo after it is added", async ({ page }) => {
  await addTodo(page, "Buy milk");

  const items = page.getByRole("list", { name: "Todos" }).getByRole("listitem");
  await expect(items).toHaveCount(1);
  await expect(items.first()).toContainText("Buy milk");
  await expect(page.getByRole("status")).toHaveCount(0);
});

test("shows a second todo after the first one", async ({ page }) => {
  await addTodo(page, "Buy milk");
  await addTodo(page, "Walk the dog");

  const items = page.getByRole("list", { name: "Todos" }).getByRole("listitem");
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toContainText("Buy milk");
  await expect(items.nth(1)).toContainText("Walk the dog");
});

test("clears the input after a todo is added", async ({ page }) => {
  await addTodo(page, "Buy milk");

  await expect(page.getByRole("textbox", { name: "New todo title" })).toHaveValue("");
});

test("adds a todo when Enter is pressed", async ({ page }) => {
  const input = page.getByRole("textbox", { name: "New todo title" });
  await input.fill("Buy milk");
  await input.press("Enter");

  await expect(
    page.getByRole("list", { name: "Todos" }).getByRole("listitem"),
  ).toHaveCount(1);
});
