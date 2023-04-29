const Vessel = require("../models/Vessel");
import { Buffer } from "buffer";
import { VesselType } from "../typing/vessel";
import dayjs from "dayjs";

type findVess = {
  city: string;
  size: string;
  type: string;
  pickupDay: string;
  returnDay: string;
  sort: string;
  page: number;
};

export const findVesselsResolver = async (parent: any, args: findVess) => {
  let vessels = await Vessel.find();

  if (args.city !== "undefined") {
    vessels = vessels.filter((vessel: VesselType) => {
      return vessel.location === args.city;
    });
  }
  if (args.type !== "undefined") {
    vessels = vessels.filter((vessel: VesselType) => {
      return vessel.type === args.type;
    });
  }
  if (args.size !== "undefined") {
    vessels = vessels.filter((vessel: VesselType) => {
      return vessel.size === args.size;
    });
  }
  vessels = vessels.filter(
    (vessel: VesselType) =>
      (dayjs(args.pickupDay).isAfter(dayjs(vessel.pickupDay)) ||
        dayjs(args.pickupDay).isSame(dayjs(vessel.pickupDay))) &&
      (dayjs(args.returnDay).isBefore(dayjs(vessel.returnDay)) ||
        dayjs(args.returnDay).isSame(dayjs(vessel.returnDay)))
  );

  const newVessels = vessels.map((vessel: VesselType) => {
    const stringifiedPictures = [
      { data: Buffer.from(vessel.pictures[0].data).toString("base64") },
    ];

    return {
      _id: vessel._id,
      name: vessel.name,
      description: vessel.description,
      user: vessel.user,
      location: vessel.location,
      year: vessel.year,
      size: vessel.size,
      type: vessel.type,
      pricePerDay: vessel.pricePerDay,
      pricePerWeek: vessel.pricePerWeek,
      pickupDay: vessel.pickupDay,
      returnDay: vessel.returnDay,
      pictures: stringifiedPictures,
      amount: vessels.length,
    };
  });

  const startIndex = (args.page - 1) * 5;
  const endIndex = args.page * 5;

  const sortCriterions = [
    { title: "The date: oldest first" },
    { title: "The date: newest first" },
    { title: "Price per day: lowest first" },
    { title: "Price per day: highest first" },
    { title: "Price per week: lowest first" },
    { title: "Price per week: highest first" },
  ];
  if (args.sort === sortCriterions[0].title) {
    return newVessels.slice(startIndex, endIndex);
  } else if (args.sort === sortCriterions[1].title) {
    newVessels.reverse();
    return newVessels.slice(startIndex, endIndex);
  } else if (args.sort === sortCriterions[2].title) {
    newVessels.sort((a: VesselType, b: VesselType) => {
      if (a.pricePerDay > b.pricePerDay) return 1;
      else if (a.pricePerDay < b.pricePerDay) return -1;
      else {
        return 0;
      }
    });
    return newVessels.slice(startIndex, endIndex);
  } else if (args.sort === sortCriterions[3].title) {
    newVessels.sort((a: VesselType, b: VesselType) => {
      if (a.pricePerDay > b.pricePerDay) return -1;
      else if (a.pricePerDay < b.pricePerDay) return 1;
      else {
        return 0;
      }
    });
    return newVessels.slice(startIndex, endIndex);
  } else if (args.sort === sortCriterions[4].title) {
    newVessels.sort((a: VesselType, b: VesselType) => {
      if (a.pricePerWeek > b.pricePerWeek) return 1;
      else if (a.pricePerWeek < b.pricePerWeek) return -1;
      else {
        return 0;
      }
    });
    return newVessels.slice(startIndex, endIndex);
  } else if (args.sort === sortCriterions[5].title) {
    newVessels.sort((a: VesselType, b: VesselType) => {
      if (a.pricePerWeek > b.pricePerWeek) return -1;
      else if (a.pricePerWeek < b.pricePerWeek) return 1;
      else {
        return 0;
      }
    });
    return newVessels.slice(startIndex, endIndex);
  }
};

export const vesNum = async (
  parent: any,
  args: {
    city: string;
    size: string;
    type: string;
    pickupDay: string;
    returnDay: string;
    sort: string;
    page: number;
  }
) => {};
