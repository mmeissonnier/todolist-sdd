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

test("marks a todo as done and keeps its position", async ({ page }) => {
  await addTodo(page, "Buy milk");
  await addTodo(page, "Walk the dog");

  await page.getByRole("checkbox", { name: "Buy milk" }).check();

  await expect(page.getByRole("checkbox", { name: "Buy milk" })).toBeChecked();
  await expect(items(page)).toHaveCount(2);
  await expect(items(page).nth(0)).toContainText("Buy milk");
  await expect(items(page).nth(1)).toContainText("Walk the dog");
});

test("marks a done todo as not done again", async ({ page }) => {
  await addTodo(page, "Buy milk");
  const checkbox = page.getByRole("checkbox", { name: "Buy milk" });

  await checkbox.check();
  await checkbox.uncheck();

  await expect(checkbox).not.toBeChecked();
});

test("leaves the other todos unaffected", async ({ page }) => {
  await addTodo(page, "Buy milk");
  await addTodo(page, "Walk the dog");

  await page.getByRole("checkbox", { name: "Buy milk" }).check();

  await expect(page.getByRole("checkbox", { name: "Walk the dog" })).not.toBeChecked();
});
