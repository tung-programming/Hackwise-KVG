// File upload middleware for resume analysis (PDF + Images)
import multer from "multer";
import { BadRequestError } from "../../utils/errors";

const storage = multer.memoryStorage();

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    // PDF
    "application/pdf",
    // Images for OCR
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/heic",
    "image/heif",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        "Invalid file type. Please upload PDF or image (PNG, JPEG, WebP, HEIC)"
      )
    );
  }
};

export const resumeFileUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});
