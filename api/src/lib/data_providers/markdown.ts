import { fromHtml } from 'hast-util-from-html';
import { toMdast } from 'hast-util-to-mdast';
import { toMarkdown } from 'mdast-util-to-markdown';

export function convertHtmlToMarkdown(html: string): string {
  const hast = fromHtml(html);
  const mdast = toMdast(hast);
  const markdown = toMarkdown(mdast);
  return markdown;
}
