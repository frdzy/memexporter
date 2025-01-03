import { Prisma } from '@prisma/client';
import { Client, isFullBlock } from '@notionhq/client';
import { markdownToBlocks } from '@tryfabric/martian';

import { Livejournal } from 'src/lib/data_providers/livejournal';
import { db } from 'src/lib/db';
import { convertHtmlToMarkdown } from 'src/lib/data_providers/markdown';

export class Notion {
  static async export(
    record: Prisma.Result<typeof db.blogImport, {}, 'findMany'>[number]
  ): Promise<null> {
    const processedEntry = Livejournal.validateJson(record.rawJson);
    if (!processedEntry) {
      return null;
    }
    const notion = new Client({ auth: process.env.NOTION_KEY });
    const pageId = process.env.NOTION_PAGE_ID;
    const { results } = await notion.blocks.children.list({
      block_id: pageId,
    });
    console.log(results);

    let dbBlockId: string | null = null;
    for (const r of results) {
      if (isFullBlock(r)) {
        if (r.type === 'child_database') {
          dbBlockId = r.id;
          console.log('existing dbBlockId: ' + dbBlockId);
          break;
        }
      }
    }
    if (!dbBlockId) {
      const result = await notion.databases.create({
        parent: { page_id: pageId },
        title: [{ text: { content: 'Imported Entries' } }],
        properties: {
          Subject: { type: 'title', title: {} },
          itemid: { type: 'number', number: { format: 'number' } },
          'Publish Time': { type: 'date', date: {} },
          logtime: { type: 'date', date: {} },
          security: {
            type: 'select',
            select: { options: [{ name: 'private' }, { name: 'public' }] },
          },
          allowmask: { type: 'number', number: { format: 'number' } },
          current_music: { type: 'rich_text', rich_text: {} },
          current_mood: { type: 'rich_text', rich_text: {} },
        },
        is_inline: true,
      });
      dbBlockId = result.id;
      console.log('created dbBlockId: ' + dbBlockId);
    }

    const markdown = await convertHtmlToMarkdown(processedEntry.event);
    const children = markdownToBlocks(markdown) as any;
    const result = await notion.pages.create({
      parent: { database_id: dbBlockId },
      properties: {
        Subject: {
          type: 'title',
          title: [{ text: { content: processedEntry.subject } }],
        },
        itemid: { type: 'number', number: processedEntry.itemid },
        'Publish Time': {
          type: 'date',
          date: { start: processedEntry.eventtime.toISOString() },
        },
        logtime: {
          type: 'date',
          date: { start: processedEntry.logtime.toISOString() },
        },
        security: { type: 'select', select: { name: processedEntry.security } },
        allowmask: { type: 'number', number: processedEntry.allowmask },
        current_music: processedEntry.current_music
          ? {
              type: 'rich_text',
              rich_text: [{ text: { content: processedEntry.current_music } }],
            }
          : undefined,
        current_mood: processedEntry.current_mood
          ? {
              type: 'rich_text',
              rich_text: [{ text: { content: processedEntry.current_mood } }],
            }
          : undefined,
      },
      children,
    });

    console.log('results', result);
    return null;
  }
}
