import { NextFunction } from "express";
import { Request, Response } from "express";
import { UserType } from "../typing/user";

const Vessel = require("./../models/Vessel");
const User = require("./../models/User");

type VesselType = {
  _id: {};
  name: String;
  description: String;
  location: String;
  year: Number;
  size: String;
  type: String;
  pictures: [{ data: { type: Buffer } }];
  pickupDay: String;
  returnDay: String;
  isFirstVessel: boolean;
};

const sharp = require("sharp");

const errorHandler = (errorCode: number, next: NextFunction) => {
  const newError: { [k: string]: any } = new Error();
  newError.statusCode = errorCode;
  console.log(newError);
  next(newError);
};

type RequestAfterAuth = Request & UserType & { token: string };

exports.addVessel = async (
  req: RequestAfterAuth,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) {
    return errorHandler(404, next);
  }
  const vessel = req.body;
  let vesselPictures = [];
  if (req.files.length > 0) {
    for (let i = 0; i < req.files.length; i++) {
      const buffer = await sharp((req.files as Array<any>)[i].buffer)
        .resize({ width: 800 })
        .toBuffer();
      vesselPictures.push({ data: buffer });
    }
  }

  if (!vessel.editedVessel) {
    const newVessel = new Vessel({
      user: req.user._id.toString(),
      name: vessel.name,
      description: vessel.description,
      size: vessel.size,
      type: vessel.type,
      year: vessel.year,
      location: vessel.location,
      pricePerDay: vessel.pricePerDay,
      pricePerWeek: vessel.pricePerWeek,
      pictures: vesselPictures,
      pickupDay: vessel.pickupDay,
      returnDay: vessel.returnDay,
    });
    if (req.user.firstVessel) {
      newVessel.isFirstVessel = true;
    }
    await newVessel.save();
    req.user.firstVessel = false;
    req.user.save();
    res.send({ message: "created" });
  } else if (vessel.editedVessel) {
    const editedVessel = await Vessel.findOne({ _id: vessel.editedVessel });
    editedVessel.name = vessel.name;
    editedVessel.description = vessel.description;
    editedVessel.size = vessel.size;
    editedVessel.type = vessel.type;
    editedVessel.year = vessel.year;
    editedVessel.location = vessel.location;
    editedVessel.pricePerDay = vessel.pricePerDay;
    editedVessel.pricePerDay = vessel.pricePerDay;
    editedVessel.pictures = vesselPictures;
    (editedVessel.pickupDay = vessel.pickupDay),
      (editedVessel.returnDay = vessel.returnDay);
    await editedVessel.save();

    res.send({ message: "updated" });
  }
};

exports.yourVessels = async (
  req: RequestAfterAuth,
  res: Response,
  next: NextFunction
) => {
  let userVessels = await Vessel.find({ user: req.user._id.toString() });

  userVessels.map((vessel: VesselType) => {
    vessel.pictures = [vessel.pictures[0]];
  });
  res.send(userVessels);
};

exports.removeVessel = async (
  req: RequestAfterAuth,
  res: Response,
  next: NextFunction
) => {
  const vessel = await Vessel.deleteOne({ _id: req.params.id });

  res.send({ message: "removed" });
};

exports.vesselOwner = async (
  req: RequestAfterAuth,
  res: Response,
  next: NextFunction
) => {
  const ves = await Vessel.findOne({ _id: req.params.id });
  res.send(ves);
};

exports.ownerContact = async (
  req: RequestAfterAuth,
  res: Response,
  next: NextFunction
) => {
  if (req.params.ownerId === "undefined") {
    res.send({ message: "undefined" });
  } else {
    const owner = await User.findOne({ _id: req.params.ownerId });
    const contactCard: {
      firstName?: string;
      lastName?: string;
      telephone?: string;
      email?: string;
      avatar?: { data: Buffer };
    } = {
      firstName: owner.info.firstName,
      lastName: owner.info.lastName,
      telephone: owner.info.telephone,
      email: owner.email,
      avatar: owner.avatar,
    };

    res.send({ contactCard });
  }
};

exports.isFavorite = async (
  req: RequestAfterAuth,
  res: Response,
  next: NextFunction
) => {
  if (!req.user.favorites) {
    res.send({ message: false });
  } else {
    if (req.user.favorites.find((vessel) => vessel === req.params.vesselId)) {
      res.send({ message: true });
    } else {
      res.send({ message: false });
    }
  }
};

exports.handleFavorite = async (
  req: RequestAfterAuth,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne({ _id: req.user._id });

  if (req.params.currentState === "true") {
    const index = req.user.favorites.findIndex(
      (vessel) => vessel === req.params.vesselId
    );
    if (index === -1) {
      res.send({ message: "changed" });
    } else {
      user.favorites = req.user.favorites.filter(
        (vessel) => vessel !== req.params.vesselId
      );

      await user.save();
    }
    res.send({ message: "changed" });
  } else if (req.params.currentState === "false") {
    user.favorites.push(req.params.vesselId);
    await user.save();
    res.send({ message: "changed" });
  }
};

exports.getFavorites = async (
  req: RequestAfterAuth,
  res: Response,
  next: NextFunction
) => {
  const vesselsIds = req.user.favorites;
  if (vesselsIds) {
    const vessels: VesselType[] = [];
    for (let i = 0; i < vesselsIds.length; i++) {
      const ves = await Vessel.findOne({ _id: vesselsIds[i] });
      if (ves !== null) vessels.push(ves);
    }
    res.send({ data: vessels });
  } else {
    res.send({ data: "noVessels" });
  }
};

exports.unlike = async (
  req: RequestAfterAuth,
  res: Response,
  next: NextFunction
) => {
  req.user.favorites = req.user.favorites.filter(
    (vesId) => req.params.vesselId !== vesId
  );
  req.user.save();
  res.send({ message: "unliked" });
};

exports.checkIfFirst = async (
  req: RequestAfterAuth,
  res: Response,
  next: NextFunction
) => {
  const isFirst = req.user.firstVessel;
  res.send({ message: isFirst });
};
