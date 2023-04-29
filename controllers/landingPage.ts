import { NextFunction } from "express";
import { Request, Response } from "express";
import { UserType } from "../typing/user";

const Vessel = require("./../models/Vessel");

const errorHandler = (errorCode: number, next: NextFunction) => {
  const newError: { [k: string]: any } = new Error();
  newError.statusCode = errorCode;
  console.log(newError);
  next(newError);
};


exports.firstVessels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const firstVessels = await Vessel.find({isFirstVessel:true})
  res.send({ vessels: firstVessels });
};
