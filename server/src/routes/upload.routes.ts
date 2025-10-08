import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { uploadPdf } from "../controllers/upload.controller.js";

const router = Router();

router.route("/").post(
  upload.fields([
    {
      name: "pdfFile", // frontend name should match this
      maxCount: 1,
    },
  ]),
  uploadPdf
);

export default router;