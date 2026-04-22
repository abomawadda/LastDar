import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../app.js";

test("GET /api/health returns ok payload", async () => {
  const app = createApp();
  const res = await request(app).get("/api/health");

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.service, "dar-alquran-server");
  assert.equal(typeof res.body.time, "string");
});