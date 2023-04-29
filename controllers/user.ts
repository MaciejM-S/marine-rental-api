import { NextFunction } from "express";
import { Request, Response } from "express";
import { UserType } from "../typing/user";

const moment = require("moment");
const sharp = require("sharp");
const bcrypt = require("bcrypt");
const generateAuthToken = require("./../helperFunctions/genrateToken");
const User = require("./../models/User");

const errorHandler = (errorCode: number, next: NextFunction) => {
  const newError: { [k: string]: any } = new Error();
  newError.statusCode = errorCode;
  next(newError);
};

type RequestAfterAuth = Request & UserType & { token: string };

exports.signIn = async (req: Request, res: Response, next: NextFunction) => {
  let newToken;
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.send({ message: "notLogged" });
  } else {
    try {
      await bcrypt.compare(
        req.body.password,
        user.password,
        async function (err: Error, result: boolean) {
          if (err) {
            res.send({ err, message: "notLogged" });
          }
          if (result) {
            newToken = await generateAuthToken(user._id.toString(), user);
            await user.save();
            return res.send({
              newToken,
              user: {
                avatar: user.avatar ? user.avatar : null,
                firstName: user.info.firstName,
                lastName: user.info.lastName,
                email: user.email,
                telephone: user.info.telephone ? user.info.telephone : null,
              },
              message: "logged",
            });
          } else {
            res.send({ message: "notLogged" });
          }
        }
      );
    } catch (e) {
      if (e instanceof Error) {
        if (e.name === "TypeError") {
          return res.send({ message: "notLogged" });
        }
      }
    }
  }
};

exports.signUp = async (req: Request, res: Response, next: NextFunction) => {
  const emailDup = await User.findOne({ email: req.body.email });
  if (emailDup) {
    return res.status(403).send({ error: "email exists" });
  } else {
    try {
      req.body.password = await bcrypt.hash(req.body.password, 8);
      const user = new User({
        email: req.body.email.trim().toLowerCase(),
        password: req.body.password,
        info: {
          firstName: req.body.fname.trim().toLowerCase(),
          lastName: req.body.lname.trim().toLowerCase(),
        },
      });

      try {
        const newToken = await generateAuthToken(user._id.toString(), user);
        await user.save();
        res.status(200).send({
          message: "created",
          newToken,
          email: user.email,
          _id: user._id,
          firstName: user.info.firstName,
          lastName: user.info.lastName,
        });
      } catch (error) {
        let message = "Unknown Error";
        if (error instanceof Error) message = error.message;
      }
      await user.save();
    } catch (e) {
      errorHandler(500, next);
    }
  }
};

exports.authenticate = async (
  req: RequestAfterAuth,
  res: Response,
  next: NextFunction
) => {
  res.send({
    user: req.user,
    message: "authorizated",
  });
};

exports.logout = async (
  req: RequestAfterAuth,
  res: Response,
  next: NextFunction
) => {
  try {
    const index = req.user.tokens.findIndex(
      (token) => token.token === req.token
    );
    req.user.tokens.splice(index, 1);
    req.user.save();
    res.send({ message: "loggedOut" });
  } catch (e) {
    errorHandler(500, next);
  }
};

exports.updateAvatar = async (
  req: RequestAfterAuth & { files: File },
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.file) {
      console.log('avatar updated');
      req.user.avatar.data = await sharp(req.file.buffer)
        .resize({ width: 150 })
        .toBuffer();
      req.user.avatar.date = moment().format("MMM DD YYYY");
    }
    await req.user.save();
    res.send({message:'succeded'});
  } catch (e) {
    errorHandler(500, next);
  }
  res.send();
};

exports.updateInfo = async ( req: RequestAfterAuth,
  res: Response,
  next: NextFunction)=>{
try{  
  const info = req.body
  req.user.info.firstName = req.body.firstName
  req.user.info.lastName = req.body.lastName
  req.user.info.telephone = req.body.telephone
  req.user.save()
  res.send(
     {message:'uploaded', info} 
    )}catch(e){
  errorHandler(500, next);
}
}

exports.updatePassword = async (req: RequestAfterAuth,
  res: Response,
  next: NextFunction) => {
      try {
        await bcrypt.compare(
          req.body.currentPass,
          req.user.password,
          async function (err: Error, result: boolean) {
            if (err) {
              res.send({ err, message: "incorrect" });
            }
            else if (result) {
              req.user.password = await bcrypt.hash(req.body.currentPass, 8)
              res.send({message:'updated'}) 
            } else {
              res.send({ message: "incorrect" });
            }
          }
        );
      } catch (e) {
        if (e instanceof Error) {
          if (e.name === "TypeError") {
            return res.send({ message: "notLogged" });
          }
        }
      }
}
