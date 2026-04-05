"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUpload = void 0;
// Multer config for file uploads
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../utils/errors");
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'application/pdf',
        'application/json',
        'text/csv',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new errors_1.BadRequestError('Invalid file type'));
    }
};
exports.fileUpload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
    },
});
//# sourceMappingURL=file-upload.js.map