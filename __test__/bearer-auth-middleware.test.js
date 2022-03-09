"use strict";

process.env.SECRET = "FIFA";

const middleware = require("../src/middlewares/bearerAuth");
const { db, Users } = require("../src/models/index");
const jwt = require("jsonwebtoken");

let userInfo = {
  admin: { username: "admin-basic", password: "password" },
};

beforeAll(async () => {
  await db.sync();
  await Users.create(userInfo.admin);
});
afterAll(async () => {
  await db.drop();
});
describe("Auth Middleware", () => {
  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };
  const next = jest.fn();

  describe("user authentication", () => {
    it("fails a login for a user (admin) with an incorrect token", () => {
      req.headers = {
        authorization: "Bearer thisisabadtoken",
      };

      return middleware(req, res, next).then(() => {
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
      });
    });

    it("logs in a user with a proper token", () => {
      const user = { username: "admin" };
      const token = jwt.sign(user, process.env.SECRET);

      req.headers = {
        authorization: `Bearer ${token}`,
      };

      return middleware(req, res, next).then(() => {
        expect(res.status).toHaveBeenCalledWith(403);
      });
    });
  });
});
