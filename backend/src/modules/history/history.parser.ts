// CSV/JSON parsing logic for history
import { parse } from 'csv-parse/sync';

interface HistoryEntry {
  title: string;
  url: string;
  watchedAt: Date;
  duration?: number;
  platform: string;
}

export const parseHistoryFile = async (file: Express.Multer.File): Promise<HistoryEntry[]> => {
  const content = file.buffer.toString('utf-8');
  const ext = file.originalname.split('.').pop()?.toLowerCase();

  if (ext === 'json') {
    return parseJsonHistory(content);
  } else if (ext === 'csv') {
    return parseCsvHistory(content);
  }

  throw new Error('Unsupported file format. Please upload JSON or CSV.');
};

const parseJsonHistory = (content: string): HistoryEntry[] => {
  const data = JSON.parse(content);
  const entries: HistoryEntry[] = [];

  // Handle YouTube Takeout format
  if (Array.isArray(data)) {
    for (const item of data) {
      if (item.title && item.titleUrl) {
        entries.push({
          title: item.title.replace('Watched ', ''),
          url: item.titleUrl,
          watchedAt: new Date(item.time),
          platform: 'youtube',
        });
      }
    }
  }

  return entries;
};

const parseCsvHistory = (content: string): HistoryEntry[] => {
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
  });

  return records.map((record: any) => ({
    title: record.title || record.Title || record.name,
    url: record.url || record.URL || record.link,
    watchedAt: new Date(record.watchedAt || record.date || record.timestamp),
    duration: record.duration ? parseInt(record.duration) : undefined,
    platform: record.platform || 'unknown',
  }));
};
