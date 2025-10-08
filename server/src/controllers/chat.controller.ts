import { Request, Response } from "express";
import { generate } from "../chat/chat.js";

export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message, threadId, namespace } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const response = await generate(message, threadId, namespace);

    res.json({
      success: true,
      data: {
        response: response,
      },
    });
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process chat message",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
