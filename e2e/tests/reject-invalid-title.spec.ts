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

const alert = (page: Page) => page.getByRole("alert");
const items = (page: Page) =>
  page.getByRole("list", { name: "Todos" }).getByRole("listitem");

test("rejects an empty title", async ({ page }) => {
  await addTodo(page, "");

  await expect(alert(page)).toHaveText("A title is required");
  await expect(page.getByRole("status")).toHaveText("No todos yet");
});

test("rejects a spaces-only title and keeps the list unchanged", async ({ page }) => {
  await addTodo(page, "Buy milk");
  await addTodo(page, "   ");

  await expect(alert(page)).toHaveText("A title is required");
  await expect(items(page)).toHaveCount(1);
  await expect(page.getByRole("textbox", { name: "New todo title" })).toHaveValue("   ");
});

test("hides the alert after the next successful add", async ({ page }) => {
  await addTodo(page, "");
  await expect(alert(page)).toBeVisible();

  await addTodo(page, "Buy milk");

  await expect(alert(page)).toHaveCount(0);
  await expect(items(page)).toHaveCount(1);
});

test("trims surrounding spaces from the title", async ({ page }) => {
  await addTodo(page, "  Buy milk  ");

  await expect(items(page).first()).toHaveText(/^Buy milk/);
});
