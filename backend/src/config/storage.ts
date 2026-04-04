// Supabase storage configuration
import { supabase } from "./database";
import { env } from "./env";

export const storage = {
  bucket: env.STORAGE_BUCKET,

  async uploadFile(
    path: string,
    file: Buffer,
    contentType: string
  ): Promise<string> {
    const { data, error } = await supabase.storage
      .from(this.bucket)
      .upload(path, file, {
        contentType,
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(this.bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  async deleteFile(path: string): Promise<void> {
    const { error } = await supabase.storage.from(this.bucket).remove([path]);
    if (error) throw error;
  },

  getPublicUrl(path: string): string {
    const { data } = supabase.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  },
};

export default storage;
