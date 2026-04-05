interface HistoryEntry {
    title?: string;
    url?: string;
    search_query?: string;
    watchedAt?: string | Date;
}
interface RecommendedInterest {
    name: string;
    description: string;
}
export declare function generateInterestsFromHistory(history: HistoryEntry[], field: string, type: string): Promise<RecommendedInterest[]>;
export {};
//# sourceMappingURL=recommender.d.ts.map