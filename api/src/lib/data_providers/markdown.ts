export async function convertHtmlToMarkdown(html: string): Promise<string> {
  const { fromHtml } = await import('hast-util-from-html');
  const { toMdast } = await import('hast-util-to-mdast');
  const { toMarkdown } = await import('mdast-util-to-markdown');

  const hast = fromHtml(html);
  const mdast = toMdast(hast);
  const markdown = toMarkdown(mdast);
  return markdown;
}
