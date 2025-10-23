// upload.routes.test.cts
import request from "supertest";
import app from "../server.js";

describe("Upload Routes", () => {
  it("POST /api/upload returns 400 when no file uploaded", async () => {
    const res = await request(app).post("/api/upload");
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No PDF file uploaded");
  });
});
