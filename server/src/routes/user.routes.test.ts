// user.routes.test.cts
import request from "supertest";
import app from "../server.js";

describe("User Routes", () => {
  it("POST /api/v1/user/register returns 400 when fields are missing", async () => {
    const res = await request(app).post("/api/v1/user/register").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Please fill all the fields");
  });

  it("POST /api/v1/user/register validates required fields", async () => {
    const res = await request(app)
      .post("/api/v1/user/register")
      .send({ name: "Test User" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please fill all the fields");
  });

  it("POST /api/v1/user/verify returns 400 when email or OTP missing", async () => {
    const res = await request(app).post("/api/v1/user/verify").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Email and OTP are required");
  });

  it("POST /api/v1/user/login returns 400 when credentials missing", async () => {
    const res = await request(app).post("/api/v1/user/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please fill all the fields");
  });

  it("GET /api/v1/user/current-user returns 400 when token not found", async () => {
    const res = await request(app).get("/api/v1/user/current-user");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Token not found");
  });

  it("GET /api/v1/user/logout clears cookie and returns success", async () => {
    const res = await request(app).get("/api/v1/user/logout");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User logged out successfully");
  });
});
