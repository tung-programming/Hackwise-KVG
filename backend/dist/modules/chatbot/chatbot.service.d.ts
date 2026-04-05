interface ChatbotAnswer {
    answer: string;
    sources: Array<{
        id: string;
        topic: string;
        question: string;
    }>;
    usedGemini: boolean;
    knowledgeBaseSize: number;
}
export declare const chatbotService: {
    getKnowledgeBaseStats: () => {
        totalQuestions: number;
        topics: string[];
    };
    ask: (message: string, maxResults?: number) => Promise<ChatbotAnswer>;
};
export {};
//# sourceMappingURL=chatbot.service.d.ts.map