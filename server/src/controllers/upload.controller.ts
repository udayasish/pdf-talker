import { Request, Response } from "express";
import { IndexTheDocument } from "../config/prepare.js";

export const uploadPdf = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    console.log("files: ", files);

    if (!files || !files.pdfFile || files.pdfFile.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded",
      });
    }

    const uploadedFile = files.pdfFile[0];
    console.log("uploadedFile: ", uploadedFile);
    const filePath = `./public/temp/${uploadedFile.filename}`;

    // Index the uploaded document with filename for namespace
    const result = await IndexTheDocument(filePath, uploadedFile.originalname);
    console.log("result: ", result);

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Failed to index PDF",
      });
    }

    // Create namespace from filename (same logic as in prepare.ts)
    const namespace = uploadedFile.originalname.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "_");

    res.json({
      success: true,
      message: "PDF uploaded and indexed successfully",
      data: {
        filename: uploadedFile.filename,
        originalName: uploadedFile.originalname,
        namespace: namespace,
        filePath: filePath,
        indexResult: result,
      },
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload and index PDF",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
