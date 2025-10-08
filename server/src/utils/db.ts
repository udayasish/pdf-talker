import mongoose from "mongoose";

export const dbConnect = async (): Promise<void> => {
  try {
    const mongoUrl: string | undefined = process.env.MONGODB_URL;

    if (!mongoUrl) {
      throw new Error("MONGODB_URL environment variable is required");
    }

    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected successfully!");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`MongoDB connection failed: ${errorMessage}`);
    throw error;
  }
};
