interface HistoryEntry {
    title: string;
    url: string;
    watchedAt: Date;
    search_query?: string;
    duration?: number;
    platform: string;
}
export declare const parseHistoryFile: (file: Express.Multer.File) => Promise<HistoryEntry[]>;
export {};
//# sourceMappingURL=history.parser.d.ts.map