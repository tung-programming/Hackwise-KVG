export declare const storage: {
    bucket: string;
    uploadFile(path: string, file: Buffer, contentType: string): Promise<string>;
    deleteFile(path: string): Promise<void>;
    getPublicUrl(path: string): string;
};
export default storage;
//# sourceMappingURL=storage.d.ts.map