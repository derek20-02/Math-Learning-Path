
import { test, expect } from "@playwright/test";

test.describe("T021 - Create Learning Activity", () => {
  test("T021-01: displays the create activity form", async ({ page }) => {
    await page.goto("/activities/new");

    await expect(
      page.getByRole("heading", {
        name: "Create Learning Activity",
      })
    ).toBeVisible();

    await expect(page.getByLabel("Title")).toBeVisible();
    await expect(page.getByLabel("Objective")).toBeVisible();
    await expect(page.getByLabel("Description")).toBeVisible();
    await expect(page.getByLabel("Difficulty")).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Create Activity" })
    ).toBeVisible();
  });

  test("T021-02: validates required fields", async ({ page }) => {
    await page.goto("/activities/new");

    const title = page.getByLabel("Title");

    await page.getByRole("button", {
      name: "Create Activity",
    }).click();

    const valueMissing = await title.evaluate(
      (input: HTMLInputElement) => input.validity.valueMissing
    );

    expect(valueMissing).toBe(true);
    await expect(title).toHaveValue("");
  });

  test("T021-03: creates an activity and displays confirmation", async ({
    page,
  }) => {
    const activityTitle = `E2E Numerical Patterns ${Date.now()}`;
    let requestReceived = false;

    page.on("pageerror", (error) => {
      console.log("Browser JavaScript error:", error.message);
    });

    page.on("request", (request) => {
      if (request.url().includes("/api/activities")) {
        console.log("API request:", request.method(), request.url());
      }
    });

    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame()) {
        console.log("Navigation:", frame.url());
      }
    });

    // Mock the API to avoid writing test data to MongoDB.
    await page.route("**/api/activities", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }

      requestReceived = true;

      const payload = route.request().postDataJSON();

      expect(payload).toMatchObject({
        title: activityTitle,
        objective: "Identify numerical patterns",
        description: "Students identify and explain numerical patterns.",
        difficulty: "medium",
      });

      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Activity created successfully.",
          activity: {
            id: "test-activity-123",
          },
        }),
      });
    });

    await page.goto("/activities/new");
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Title").fill(activityTitle);
    await page.getByLabel("Objective").fill("Identify numerical patterns");
    await page.getByLabel("Description").fill(
      "Students identify and explain numerical patterns."
    );
    await page.getByLabel("Difficulty").selectOption("medium");

    const validation = await page.locator("form").evaluate(
      (form: HTMLFormElement) => ({
        valid: form.checkValidity(),
        invalidFields: Array.from(form.elements)
          .filter(
            (
              element
            ): element is
              | HTMLInputElement
              | HTMLTextAreaElement
              | HTMLSelectElement =>
              element instanceof HTMLInputElement ||
              element instanceof HTMLTextAreaElement ||
              element instanceof HTMLSelectElement
          )
          .filter((element) => !element.validity.valid)
          .map((element) => element.name),
      })
    );

    console.log("T021-03 validation:", validation);
    expect(validation.valid).toBe(true);

    console.log("URL before click:", page.url());

    await page.getByRole("button", {
      name: "Create Activity",
    }).click();

    console.log("URL after click:", page.url());
    console.log(
      "Status message:",
      await page.getByRole("status").allTextContents()
    );
    console.log(
      "Error message:",
      await page.getByRole("alert").allTextContents()
    );
    console.log(
      "Title after click:",
      await page.getByLabel("Title").inputValue()
    );

    await expect
      .poll(() => requestReceived, {
        message: "Expected a POST request to /api/activities",
      })
      .toBe(true);

    await expect(page.getByRole("status")).toContainText(
      "Activity created successfully."
    );

    await expect(page.getByRole("status")).toContainText(
      "test-activity-123"
    );

    await expect(page.getByLabel("Title")).toHaveValue("");
    await expect(page.getByLabel("Objective")).toHaveValue("");
    await expect(page.getByLabel("Description")).toHaveValue("");
    await expect(page.getByLabel("Difficulty")).toHaveValue("medium");
  });

  test("T021-04: displays an API error", async ({ page }) => {
    let requestReceived = false;

    page.on("pageerror", (error) => {
      console.log("Browser JavaScript error:", error.message);
    });

    page.on("request", (request) => {
      if (request.url().includes("/api/activities")) {
        console.log("API request:", request.method(), request.url());
      }
    });

    await page.route("**/api/activities", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }

      requestReceived = true;

      await route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Forbidden: teacher access required.",
        }),
      });
    });

    await page.goto("/activities/new");
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Title").fill("Numerical Patterns");
    await page.getByLabel("Objective").fill("Identify patterns");
    await page.getByLabel("Description").fill(
      "Students identify numerical patterns."
    );
    await page.getByLabel("Difficulty").selectOption("medium");

    const formValid = await page.locator("form").evaluate(
      (form: HTMLFormElement) => form.checkValidity()
    );

    console.log("T021-04 form valid:", formValid);
    expect(formValid).toBe(true);

    await page.getByRole("button", {
      name: "Create Activity",
    }).click();

    console.log("T021-04 URL after click:", page.url());
    console.log(
      "T021-04 status:",
      await page.getByRole("status").allTextContents()
    );
    console.log(
      "T021-04 error:",
      await page.getByRole("alert").allTextContents()
    );

    await expect
      .poll(() => requestReceived, {
        message: "Expected a POST request to /api/activities",
      })
      .toBe(true);

    await expect(page.getByRole("alert")).toContainText(
      "Forbidden: teacher access required."
    );
  });
});

