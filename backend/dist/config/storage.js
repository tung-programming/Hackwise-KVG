"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
// Supabase storage configuration
const database_1 = require("./database");
const env_1 = require("./env");
exports.storage = {
    bucket: env_1.env.STORAGE_BUCKET,
    async uploadFile(path, file, contentType) {
        const { data, error } = await database_1.supabase.storage
            .from(this.bucket)
            .upload(path, file, {
            contentType,
            upsert: true,
        });
        if (error)
            throw error;
        const { data: urlData } = database_1.supabase.storage
            .from(this.bucket)
            .getPublicUrl(data.path);
        return urlData.publicUrl;
    },
    async deleteFile(path) {
        const { error } = await database_1.supabase.storage.from(this.bucket).remove([path]);
        if (error)
            throw error;
    },
    getPublicUrl(path) {
        const { data } = database_1.supabase.storage.from(this.bucket).getPublicUrl(path);
        return data.publicUrl;
    },
};
exports.default = exports.storage;
//# sourceMappingURL=storage.js.map