import { supabase } from "../lib/supabase";

export interface UploadResult {
  filePath: string;
  fileUrl: string;
}

export const fileUploadService = {
  async uploadDocument(
    customerId: string,
    documentName: string,
    file: File
  ): Promise<UploadResult> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${customerId}/${documentName
      .replace(/\s+/g, "-")
      .toLowerCase()}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("solar-documents")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("solar-documents").getPublicUrl(fileName);

    return {
      filePath: fileName,
      fileUrl: publicUrl,
    };
  },

  async deleteDocument(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from("solar-documents")
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  },

  async getDocumentUrl(filePath: string): Promise<string> {
    const {
      data: { publicUrl },
    } = supabase.storage.from("solar-documents").getPublicUrl(filePath);

    return publicUrl;
  },

  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File size exceeds 10MB limit",
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error:
          "Invalid file type. Only PDF, JPEG, PNG, and Word documents are allowed",
      };
    }

    return { valid: true };
  },
};
