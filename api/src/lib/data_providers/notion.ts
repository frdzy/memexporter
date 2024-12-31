import { Prisma } from '@prisma/client';
import { Client } from '@notionhq/client';
import { markdownToBlocks } from '@tryfabric/martian';

import { Livejournal } from 'src/lib/data_providers/livejournal';
import { db } from 'src/lib/db';
import { convertHtmlToMarkdown } from 'src/lib/data_providers/markdown.js';

function convertContentFromHtmlToBlocks(content: string) {
  return markdownToBlocks(convertHtmlToMarkdown(content));
}

export class Notion {
  static async export(
    record: Prisma.Result<typeof db.blogImport, {}, 'findMany'>[number]
  ): Promise<CreatePageResponse | null> {
    const processedEntry = Livejournal.validate(JSON.parse(record.rawJson));
    if (!processedEntry) {
      return null;
    }
    const children = convertContentFromHtmlToBlocks(processedEntry.event);
    const notion = new Client({ auth: process.env.NOTION_KEY });
    const pageId = process.env.NOTION_PAGE_ID;
    return await notion.pages.create({
      parent: { database_id: pageId },
      properties: {
        Name: { title: [{ text: { content: processedEntry.subject } }] },
      },
      children,
    });
  }
}
