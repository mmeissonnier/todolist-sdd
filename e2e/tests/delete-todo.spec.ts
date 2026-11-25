import { expect, test, type Page } from "@playwright/test";

// Elements are located only through the accessible names in
// specs/001-basic-todo-list/contracts/ui-contract.md.

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

async function addTodo(page: Page, title: string) {
  await page.getByRole("textbox", { name: "New todo title" }).fill(title);
  await page.getByRole("button", { name: "Add" }).click();
}

const items = (page: Page) =>
  page.getByRole("list", { name: "Todos" }).getByRole("listitem");

test("deletes one of several todos", async ({ page }) => {
  await addTodo(page, "Buy milk");
  await addTodo(page, "Walk the dog");

  await page.getByRole("button", { name: "Delete Buy milk" }).click();

  await expect(items(page)).toHaveCount(1);
  await expect(items(page).first()).toContainText("Walk the dog");
});

test("deletes a done todo", async ({ page }) => {
  await addTodo(page, "Buy milk");
  await addTodo(page, "Walk the dog");
  await page.getByRole("checkbox", { name: "Buy milk" }).check();

  await page.getByRole("button", { name: "Delete Buy milk" }).click();

  await expect(items(page)).toHaveCount(1);
  await expect(items(page).first()).toContainText("Walk the dog");
});

test("shows the empty state after deleting the last todo", async ({ page }) => {
  await addTodo(page, "Buy milk");

  await page.getByRole("button", { name: "Delete Buy milk" }).click();

  await expect(page.getByRole("status")).toHaveText("No todos yet");
  await expect(page.getByRole("list", { name: "Todos" })).toHaveCount(0);
});
