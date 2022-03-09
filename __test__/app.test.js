"use strict";

process.env.SECRET = "FIFA";

const server = require("../src/server");
const supertest = require("supertest");
const { db } = require("../src/models/index");

const mockRequest = supertest(server.app);

let users = {
  admin: { username: "admin", password: "password" },
  editor: { username: "editor", password: "password" },
  user: { username: "user", password: "password" },
};

beforeAll(async () => {
  await db.sync();
});
afterAll(async () => {
  await db.drop();
});

describe("Auth Router", () => {
  Object.keys(users).forEach((userType) => {
    describe(`${userType} users`, () => {
      it("can create one", async () => {
        const response = await mockRequest
          .post("/signup")
          .send(users[userType]);
        const userObject = response.body;

        expect(response.status).toBe(201);
        expect(userObject.id).toBeDefined();
        expect(userObject.username).toEqual(users[userType].username);
      });

      it("can signin with basic", async () => {
        const response = await mockRequest
          .post("/signin")
          .auth(users[userType].username, users[userType].password);

        const userObject = response.body;
        expect(response.status).toBe(200);
        expect(userObject.token).toBeDefined();
        expect(userObject.username).toEqual(users[userType].username);
      });

      it("can signin with bearer", async () => {
        const response = await mockRequest
          .post("/signin")
          .auth(users[userType].username, users[userType].password);

        const token = response.body.token;

        const bearerResponse = await mockRequest
          .get("/users")
          .set("Authorization", `Bearer ${token}`);

        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(200);
      });
    });

    describe("bad logins", () => {
      it("basic fails with known user and wrong password ", async () => {
        const response = await mockRequest.post("/signin").auth("admin", "xyz");
        const userObject = response.body;

        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined();
      });

      it("basic fails with unknown user", async () => {
        const response = await mockRequest
          .post("/signin")
          .auth("nobody", "xyz");
        const userObject = response.body;

        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined();
      });

      it("bearer fails with an invalid token", async () => {
        // First, use basic to login to get a token
        const bearerResponse = await mockRequest
          .get("/users")
          .set("Authorization", `Bearer foobar`);

        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(403);
      });
    });
  });
});
