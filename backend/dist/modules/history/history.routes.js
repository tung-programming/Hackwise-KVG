"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// History routes
const express_1 = require("express");
const history_controller_1 = require("./history.controller");
const auth_guard_1 = require("../../middleware/auth.guard");
const file_upload_1 = require("../../middleware/file-upload");
const router = (0, express_1.Router)();
router.use(auth_guard_1.authGuard);
router.post("/upload", file_upload_1.fileUpload.single("file"), history_controller_1.historyController.uploadHistory);
router.get("/", history_controller_1.historyController.getHistory);
router.get("/:id/status", history_controller_1.historyController.getStatus);
router.delete("/:id", history_controller_1.historyController.deleteHistory);
exports.default = router;
//# sourceMappingURL=history.routes.js.map