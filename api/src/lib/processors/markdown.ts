export async function convertHtmlToMarkdown(raw: string): Promise<string> {
  const { fromMarkdown } = await import('mdast-util-from-markdown');
  const { gfmTableFromMarkdown, gfmTableToMarkdown } = await import(
    'mdast-util-gfm-table'
  );
  const { toMarkdown } = await import('mdast-util-to-markdown');
  const { gfmTable } = await import('micromark-extension-gfm-table');
  const rehypeParse = await import('rehype-parse');
  const remarkBreaks = await import('remark-breaks');
  const remarkGfm = await import('remark-gfm');
  const remarkStringify = await import('remark-stringify');
  const rehypeRemark = await import('rehype-remark');
  const { unified } = await import('unified');

  const html = raw
    .split('\n')
    .map((n) => `<p>${n}</p>`)
    .join('');
  const file = await unified()
    .use(rehypeParse.default)
    .use(rehypeRemark.default, { newlines: true })
    .use(remarkBreaks.default)
    .use(remarkGfm.default)
    .use(remarkStringify.default)
    .process(html);

  console.log('file', String(file));

  // Fix up tables with rows that contain missing or extra cells
  const tree = fromMarkdown(String(file), {
    extensions: [gfmTable()],
    mdastExtensions: [gfmTableFromMarkdown()],
  });
  const output = toMarkdown(tree, { extensions: [gfmTableToMarkdown()] });

  return output;
}
