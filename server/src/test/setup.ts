import mongoose from "mongoose";

// Cleanup after all tests
afterAll(async () => {
  // Close MongoDB connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});
