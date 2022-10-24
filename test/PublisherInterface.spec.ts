import { test, expect } from "@playwright/test";
import { readdirSync } from "fs";

for (const testFile of readdirSync(__dirname + "/tests")) {
  test("Test " + testFile.replace(".js", ""), async ({ page }) => {
    await page.goto("http://localhost:3001");
    const result = await page.evaluate(
      (tests) => window.runTest(tests),
      testFile
    );
    expect(result).toBe(true);
  });
}
