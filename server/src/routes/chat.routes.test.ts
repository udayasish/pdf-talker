// chat.routes.test.cts
import request from "supertest";
import app from "../server.js";

describe("Chat Routes", () => {
  it("POST /api/chat returns 400 when message is missing", async () => {
    const res = await request(app).post("/api/chat").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Message is required");
  });

  it("POST /api/chat accepts message, threadId, and namespace", async () => {
    const res = await request(app).post("/api/chat").send({
      message: "Hello",
      threadId: "thread123",
      namespace: "test_namespace",
    });
    expect(res.body).toHaveProperty("success");
  });
});
