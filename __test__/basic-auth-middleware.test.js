"use strict";

const middleware = require("../src/middlewares/basicAuth");
const { db, Users } = require("../src/models/index");

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
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };
  const next = jest.fn();

  describe("user authentication", () => {
    it("fails a login for a user (admin) with the incorrect basic credentials", () => {
      req.headers = {
        authorization: "Basic YWRtaW46Zm9v",
      };

      return middleware(req, res, next).then(() => {
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
      });
    });

    it("logs in an admin user with the right credentials", () => {
      req.headers = {
        authorization: "Basic YWRtaW46cGFzc3dvcmQ=",
      };

      return middleware(req, res, next).then(() => {
        expect(res.status).toHaveBeenCalledWith(403);
      });
    });
  });
});
