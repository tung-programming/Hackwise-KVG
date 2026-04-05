"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHistoryFile = void 0;
// CSV/JSON parsing logic for history
const sync_1 = require("csv-parse/sync");
const parseHistoryFile = async (file) => {
    const content = file.buffer.toString('utf-8');
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (ext === 'json') {
        return parseJsonHistory(content);
    }
    else if (ext === 'csv') {
        return parseCsvHistory(content);
    }
    throw new Error('Unsupported file format. Please upload JSON or CSV.');
};
exports.parseHistoryFile = parseHistoryFile;
const parseJsonHistory = (content) => {
    const data = JSON.parse(content);
    const entries = [];
    const parseDate = (value) => {
        const d = value ? new Date(value) : new Date();
        return Number.isNaN(d.getTime()) ? new Date() : d;
    };
    const pushEntry = (item) => {
        const title = String(item?.title || item?.name || item?.pageTitle || '').trim();
        const searchQuery = String(item?.search_query || item?.searchQuery || item?.query || '').trim();
        const url = String(item?.titleUrl || item?.url || item?.link || '').trim();
        if (!title && !searchQuery && !url)
            return;
        entries.push({
            title: title || searchQuery || 'Search activity',
            search_query: searchQuery || undefined,
            url,
            watchedAt: parseDate(item?.watchedAt || item?.time || item?.timestamp || item?.date || item?.visitedAt || item?.created_at),
            duration: item?.duration ? parseInt(String(item.duration), 10) : undefined,
            platform: String(item?.platform || item?.source || 'unknown'),
        });
    };
    const walk = (node) => {
        if (!node)
            return;
        if (Array.isArray(node)) {
            node.forEach(walk);
            return;
        }
        if (typeof node !== 'object')
            return;
        if (node.title || node.search_query || node.searchQuery || node.query || node.url || node.titleUrl || node.link) {
            pushEntry(node);
        }
        for (const value of Object.values(node)) {
            if (value && (Array.isArray(value) || typeof value === 'object')) {
                walk(value);
            }
        }
    };
    walk(data);
    return entries.slice(0, 5000);
};
const parseCsvHistory = (content) => {
    const records = (0, sync_1.parse)(content, {
        columns: true,
        skip_empty_lines: true,
    });
    return records.map((record) => ({
        title: record.title || record.Title || record.name || record.search_query || record.query || 'Search activity',
        search_query: record.search_query || record.searchQuery || record.query || undefined,
        url: record.url || record.URL || record.link,
        watchedAt: new Date(record.watchedAt || record.date || record.timestamp),
        duration: record.duration ? parseInt(record.duration) : undefined,
        platform: record.platform || 'unknown',
    }));
};
//# sourceMappingURL=history.parser.js.map