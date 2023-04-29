import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

type CustomRequest = Request & {
  user: {};
  token: string | undefined;
  file: File;
};

const User = require("../models/User");

const authorization = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  let decoded;
  let user;
  try {
    token = req.header("Authorization")?.split(" ")[1];

    if (token) {
      decoded = jwt.verify(token, "ozy@man11119") as {
        id: string;
        iat: number;
        exp: number;
      };
    }
    if (decoded) {
      user = await User.findOne({ id: decoded.id, "tokens.token": token });
    }
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authorizate" });
  }
};

module.exports = authorization;
