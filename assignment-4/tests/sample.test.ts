import { execFileSync } from "node:child_process";
import { expect, type Page, test } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

function uniqueSuffix() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function resetDatabase() {
  execFileSync(
    "npx",
    ["prisma", "db", "execute", "--file", "tests/reset.sql"],
    {
      stdio: "ignore",
    },
  );
}

async function createAuthorViaUI(
  page: Page,
  data: {
    name: string;
    email?: string;
    affiliation?: string;
  },
) {
  await page.goto(`${BASE_URL}/authors/create`);

  await page.fill('input[name="name"]', data.name);
  await page.fill('input[name="email"]', data.email ?? "");
  await page.fill('input[name="affiliation"]', data.affiliation ?? "");

  await page.getByTestId("create-author-btn").click();

  await expect(page.getByTestId("status-message")).toHaveText(
    "Author created successfully",
  );

  await page.waitForTimeout(3200);
  await expect(page).toHaveURL(`${BASE_URL}/`);
}

async function createPaperViaUI(
  page: Page,
  data: {
    title: string;
    publishedIn: string;
    year: string;
    authorNames: string[];
  },
) {
  await page.goto(`${BASE_URL}/papers/create`);

  await page.fill('input[name="title"]', data.title);
  await page.fill('input[name="publishedIn"]', data.publishedIn);
  await page.fill('input[name="year"]', data.year);

  const options = page.getByTestId("author-dropdown").locator("option");
  const count = await options.count();
  const selectedValues: string[] = [];

  for (let i = 0; i < count; i++) {
    const option = options.nth(i);
    const text = ((await option.textContent()) ?? "").trim();
    if (data.authorNames.includes(text)) {
      const value = await option.getAttribute("value");
      if (value) {
        selectedValues.push(value);
      }
    }
  }

  await page.getByTestId("author-dropdown").selectOption(selectedValues);
  await page.getByTestId("create-paper-btn").click();

  await expect(page.getByTestId("status-message")).toHaveText(
    "Paper created successfully",
  );

  await page.waitForTimeout(3200);
  await expect(page).toHaveURL(`${BASE_URL}/`);
}

test.describe("Assignment 4", () => {
  test.beforeEach(() => {
    resetDatabase();
  });

  // ============================================================
  // Home Route (`/`): Paper List Display
  // ============================================================

  test("Home Route: Page Layout and Links", async ({ page }) => {
    await page.goto(BASE_URL);

    const mainHeading = page.getByRole("heading", {
      name: "Paper Management System",
    });
    const papersHeading = page.getByRole("heading", { name: "Papers" });
    const createPaperBtn = page.getByRole("link", { name: "Create New Paper" });
    const createAuthorBtn = page.getByRole("link", {
      name: "Create New Author",
    });

    await expect(mainHeading).toBeVisible();
    await expect(papersHeading).toBeVisible();
    await expect(createPaperBtn).toBeVisible();
    await expect(createAuthorBtn).toBeVisible();

    await expect(mainHeading).toHaveClass(/text-3xl/);
    await expect(mainHeading).toHaveClass(/font-bold/);

    await expect(papersHeading).toHaveClass(/text-xl/);
    await expect(papersHeading).toHaveClass(/font-semibold/);

    await expect(createPaperBtn).toHaveAttribute("href", "/papers/create");
    await expect(createAuthorBtn).toHaveAttribute("href", "/authors/create");
  });

  test("Home Route: Empty State shows 'No papers found' when database is empty", async ({
    page,
  }) => {
    await page.goto(BASE_URL);
    await expect(
      page.getByText("No papers found", { exact: true }),
    ).toBeVisible();
  });

  test("Home Route: Paper Rendering for two papers", async ({ page }) => {
    const unique = uniqueSuffix();

    const author1 = `Author 1 ${unique}`;
    const author2 = `Author 2 ${unique}`;
    const author3 = `Author 3 ${unique}`;

    await createAuthorViaUI(page, { name: author1 });
    await createAuthorViaUI(page, { name: author2 });
    await createAuthorViaUI(page, { name: author3 });

    await createPaperViaUI(page, {
      title: `Paper One ${unique}`,
      publishedIn: "ICSE",
      year: "2024",
      authorNames: [author1, author2],
    });

    await createPaperViaUI(page, {
      title: `Paper Two ${unique}`,
      publishedIn: "NeurIPS",
      year: "2023",
      authorNames: [author3],
    });

    await page.goto(BASE_URL);

    const firstHeading = page.getByRole("heading", {
      name: `Paper One ${unique}`,
    });
    await expect(firstHeading).toBeVisible();
    const firstCard = firstHeading.locator("xpath=ancestor::li[1]");

    await expect(firstCard).toContainText("ICSE");
    await expect(firstCard).toContainText("2024");
    await expect(firstCard).toContainText(author1);
    await expect(firstCard).toContainText(author2);
    await expect(firstCard).toContainText(`${author1}, ${author2}`);

    const secondHeading = page.getByRole("heading", {
      name: `Paper Two ${unique}`,
    });
    await expect(secondHeading).toBeVisible();
    const secondCard = secondHeading.locator("xpath=ancestor::li[1]");

    await expect(secondCard).toContainText("NeurIPS");
    await expect(secondCard).toContainText("2023");
    await expect(secondCard).toContainText(author3);
  });

  // ============================================================
  // Create Paper Route (`/papers/create`)
  // ============================================================

  test("Create Paper Route: Page Rendering", async ({ page }) => {
    const unique = uniqueSuffix();

    await createAuthorViaUI(page, { name: `A1 ${unique}` });
    await createAuthorViaUI(page, { name: `A2 ${unique}` });
    await createAuthorViaUI(page, { name: `A3 ${unique}` });

    await page.goto(`${BASE_URL}/papers/create`);

    await expect(
      page.getByRole("heading", { name: "Create New Paper" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Back" })).toBeVisible();
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('input[name="publishedIn"]')).toBeVisible();
    await expect(page.locator('input[name="year"]')).toBeVisible();
    await expect(page.getByTestId("create-paper-btn")).toBeVisible();

    const dropdown = page.getByTestId("author-dropdown");
    await expect(dropdown).toBeVisible();

    const optionTexts = await dropdown.locator("option").allTextContents();
    expect(optionTexts).toEqual([
      `A1 ${unique}`,
      `A2 ${unique}`,
      `A3 ${unique}`,
    ]);

    await page.getByRole("link", { name: "Back" }).click();
    await expect(page).toHaveURL(`${BASE_URL}/`);
  });

  test("Create Paper Route: Author dropdown shows 'No authors available' if empty", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/papers/create`);

    const dropdown = page.getByTestId("author-dropdown");
    await expect(dropdown).toBeVisible();

    const optionTexts = await dropdown.locator("option").allTextContents();
    expect(optionTexts).toContain("No authors available");
  });

  test("Create Paper Route: Validation - Title is required for empty string", async ({
    page,
  }) => {
    const unique = uniqueSuffix();
    await createAuthorViaUI(page, { name: `Author ${unique}` });

    await page.goto(`${BASE_URL}/papers/create`);

    await page.fill('input[name="title"]', "");
    await page.fill('input[name="publishedIn"]', "IEEE");
    await page.fill('input[name="year"]', "2024");

    const value = await page
      .getByTestId("author-dropdown")
      .locator("option")
      .first()
      .getAttribute("value");

    await page.getByTestId("author-dropdown").selectOption([value ?? ""]);
    await page.getByTestId("create-paper-btn").click();

    const msg = page.getByTestId("status-message");
    await expect(msg).toHaveText("Title is required");
    await expect(msg).toHaveClass(/text-sm/);
    await expect(msg).toHaveClass(/text-red-800/);
  });

  test("Create Paper Route: Validation - Publication venue is required for empty string", async ({
    page,
  }) => {
    const unique = uniqueSuffix();
    await createAuthorViaUI(page, { name: `Author ${unique}` });

    await page.goto(`${BASE_URL}/papers/create`);

    await page.fill('input[name="title"]', "Some Title");
    await page.fill('input[name="publishedIn"]', "");
    await page.fill('input[name="year"]', "2024");

    const value = await page
      .getByTestId("author-dropdown")
      .locator("option")
      .first()
      .getAttribute("value");

    await page.getByTestId("author-dropdown").selectOption([value ?? ""]);
    await page.getByTestId("create-paper-btn").click();

    await expect(page.getByTestId("status-message")).toHaveText(
      "Publication venue is required",
    );
  });

  test("Create Paper Route: Validation - Publication year is required for empty string", async ({
    page,
  }) => {
    const unique = uniqueSuffix();
    await createAuthorViaUI(page, { name: `Author ${unique}` });

    await page.goto(`${BASE_URL}/papers/create`);

    await page.fill('input[name="title"]', "Some Title");
    await page.fill('input[name="publishedIn"]', "IEEE");
    await page.fill('input[name="year"]', "");

    const value = await page
      .getByTestId("author-dropdown")
      .locator("option")
      .first()
      .getAttribute("value");

    await page.getByTestId("author-dropdown").selectOption([value ?? ""]);
    await page.getByTestId("create-paper-btn").click();

    await expect(page.getByTestId("status-message")).toHaveText(
      "Publication year is required",
    );
  });

  test("Create Paper Route: Validation - Valid year after 1900 is required for 1900", async ({
    page,
  }) => {
    const unique = uniqueSuffix();
    await createAuthorViaUI(page, { name: `Author ${unique}` });

    await page.goto(`${BASE_URL}/papers/create`);

    await page.fill('input[name="title"]', "Some Title");
    await page.fill('input[name="publishedIn"]', "IEEE");
    await page.fill('input[name="year"]', "1900");

    const value = await page
      .getByTestId("author-dropdown")
      .locator("option")
      .first()
      .getAttribute("value");

    await page.getByTestId("author-dropdown").selectOption([value ?? ""]);
    await page.getByTestId("create-paper-btn").click();

    await expect(page.getByTestId("status-message")).toHaveText(
      "Valid year after 1900 is required",
    );
  });

  test("Create Paper Route: Validation - Please select at least one author", async ({
    page,
  }) => {
    const unique = uniqueSuffix();
    await createAuthorViaUI(page, { name: `Author ${unique}` });

    await page.goto(`${BASE_URL}/papers/create`);

    await page.fill('input[name="title"]', "Some Title");
    await page.fill('input[name="publishedIn"]', "IEEE");
    await page.fill('input[name="year"]', "2024");
    await page.getByTestId("create-paper-btn").click();

    await expect(page.getByTestId("status-message")).toHaveText(
      "Please select at least one author",
    );
  });

  test("Create Paper Route: Successful creation with one author", async ({
    page,
    request,
  }) => {
    const unique = uniqueSuffix();
    const author = `Single Author ${unique}`;

    await createAuthorViaUI(page, { name: author });

    await page.goto(`${BASE_URL}/papers/create`);

    await page.fill('input[name="title"]', `Created One ${unique}`);
    await page.fill('input[name="publishedIn"]', "IEEE");
    await page.fill('input[name="year"]', "2025");

    const options = page.getByTestId("author-dropdown").locator("option");
    const count = await options.count();
    let selectedValue = "";

    for (let i = 0; i < count; i++) {
      const text = ((await options.nth(i).textContent()) ?? "").trim();
      if (text === author) {
        selectedValue = (await options.nth(i).getAttribute("value")) ?? "";
        break;
      }
    }

    await page.getByTestId("author-dropdown").selectOption([selectedValue]);
    await page.getByTestId("create-paper-btn").click();

    const msg = page.getByTestId("status-message");
    await expect(msg).toHaveText("Paper created successfully");
    await expect(msg).toHaveClass(/text-sm/);

    await page.waitForTimeout(3200);
    await expect(page).toHaveURL(`${BASE_URL}/`);

    const response = await request.get(`${BASE_URL}/api/papers`);
    expect(response.ok()).toBeTruthy();

    const papers = await response.json();
    const created = papers.find(
      (p: any) => p.title === `Created One ${unique}`,
    );

    expect(created).toBeTruthy();
    expect(created.publishedIn).toBe("IEEE");
    expect(created.year).toBe(2025);
    expect(created.authors).toHaveLength(1);
    expect(created.authors[0].name).toBe(author);
  });

  test("Create Paper Route: Successful creation with two authors", async ({
    page,
    request,
  }) => {
    const unique = uniqueSuffix();
    const author1 = `Multi Author 1 ${unique}`;
    const author2 = `Multi Author 2 ${unique}`;

    await createAuthorViaUI(page, { name: author1 });
    await createAuthorViaUI(page, { name: author2 });

    await page.goto(`${BASE_URL}/papers/create`);

    await page.fill('input[name="title"]', `Created Two ${unique}`);
    await page.fill('input[name="publishedIn"]', "SIGMOD");
    await page.fill('input[name="year"]', "2024");

    const options = page.getByTestId("author-dropdown").locator("option");
    const count = await options.count();
    const values: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = ((await options.nth(i).textContent()) ?? "").trim();
      if (text === author1 || text === author2) {
        const value = await options.nth(i).getAttribute("value");
        if (value) {
          values.push(value);
        }
      }
    }

    await page.getByTestId("author-dropdown").selectOption(values);
    await page.getByTestId("create-paper-btn").click();

    await expect(page.getByTestId("status-message")).toHaveText(
      "Paper created successfully",
    );

    await page.waitForTimeout(3200);
    await expect(page).toHaveURL(`${BASE_URL}/`);

    const response = await request.get(`${BASE_URL}/api/papers`);
    expect(response.ok()).toBeTruthy();

    const papers = await response.json();
    const created = papers.find(
      (p: any) => p.title === `Created Two ${unique}`,
    );

    expect(created).toBeTruthy();
    expect(created.publishedIn).toBe("SIGMOD");
    expect(created.year).toBe(2024);
    expect(created.authors).toHaveLength(2);

    const names = created.authors.map((a: any) => a.name).sort();
    expect(names).toEqual([author1, author2].sort());
  });

  // ============================================================
  // Create Author Route (`/authors/create`)
  // ============================================================

  test("Create Author Route: Page Rendering", async ({ page }) => {
    await page.goto(`${BASE_URL}/authors/create`);

    const heading = page.getByRole("heading", { name: "Create New Author" });

    await expect(heading).toBeVisible();

    await expect(page.getByRole("link", { name: "Back" })).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="affiliation"]')).toBeVisible();
    await expect(page.getByTestId("create-author-btn")).toBeVisible();

    await page.getByRole("link", { name: "Back" }).click();
    await expect(page).toHaveURL(`${BASE_URL}/`);
  });

  test("Create Author Route: Validation - Name is required for empty string", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/authors/create`);

    await page.fill('input[name="name"]', "");
    await page.getByTestId("create-author-btn").click();

    const msg = page.getByTestId("status-message");
    await expect(msg).toHaveText("Name is required");
  });

  test("Create Author Route: Successful creation", async ({ page }) => {
    const unique = uniqueSuffix();
    const name = `Author ${unique}`;
    const email = `author-${unique}@example.com`;
    const affiliation = `Affiliation ${unique}`;

    await page.goto(`${BASE_URL}/authors/create`);

    await page.fill('input[name="name"]', name);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="affiliation"]', affiliation);
    await page.getByTestId("create-author-btn").click();

    const msg = page.getByTestId("status-message");
    await expect(msg).toHaveText("Author created successfully");
    await expect(msg).toHaveClass(/text-sm/);

    await page.goto(`${BASE_URL}/papers/create`);
    const optionTexts = await page
      .getByTestId("author-dropdown")
      .locator("option")
      .allTextContents();

    expect(optionTexts).toContain(name);
  });
});
