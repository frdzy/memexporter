export type LivejournalImport = {
  itemid: number;
  eventtime: Date;
  logtime: Date;
  subject: string;
  event: string;
  security: string;
  allowmask: number;
  current_music?: string;
  current_mood?: string;
};

function isRecord(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

export class Livejournal {
  static validate(rawResult: any): LivejournalImport | null {
    if (
      !isRecord(rawResult) ||
      typeof rawResult.itemid !== 'string' ||
      typeof rawResult.eventtime !== 'string' ||
      typeof rawResult.logtime !== 'string' ||
      typeof rawResult.subject !== 'string' ||
      typeof rawResult.event !== 'string' ||
      typeof rawResult.security !== 'string' ||
      typeof rawResult.allowmask !== 'string'
    ) {
      console.log('failed validation', rawResult);
      return null;
    }
    const { itemid, eventtime, logtime, subject, event, security, allowmask } =
      rawResult;

    return {
      itemid: +itemid,
      eventtime: new Date(eventtime),
      logtime: new Date(logtime),
      subject,
      event,
      security,
      allowmask: +allowmask,
    };
  }

  static validateJson(rawInput: string): LivejournalImport | null {
    const rawResult = JSON.parse(rawInput);
    if (
      !isRecord(rawResult) ||
      typeof rawResult.itemid !== 'number' ||
      typeof rawResult.eventtime !== 'string' ||
      typeof rawResult.logtime !== 'string' ||
      typeof rawResult.subject !== 'string' ||
      typeof rawResult.event !== 'string' ||
      typeof rawResult.security !== 'string' ||
      typeof rawResult.allowmask !== 'number'
    ) {
      console.log('failed validation', rawResult);
      return null;
    }
    const { itemid, eventtime, logtime, subject, event, security, allowmask } =
      rawResult;

    return {
      itemid,
      eventtime: new Date(eventtime),
      logtime: new Date(logtime),
      subject,
      event,
      security,
      allowmask,
    };
  }
}
