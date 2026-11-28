import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

/**
 * Plain Markdown renderer using remark -> rehype-sanitize.
 * Zero MDX JSX runtime evaluation, zero raw HTML passthrough.
 */
export async function renderSafeMarkdown(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype) // allowDangerousHtml defaults to false
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}
