import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

export async function runWcag22Scan(
  page: Page,
  contextLabel: string
): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  const formatted = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    nodes: v.nodes.map((n) => n.target.join(" > ")),
  }));

  expect(
    formatted,
    `WCAG 2.2 AA violations on ${contextLabel}: ${JSON.stringify(formatted, null, 2)}`
  ).toEqual([]);
}
