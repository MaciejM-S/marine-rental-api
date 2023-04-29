"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vesNum = exports.findVesselsResolver = void 0;
const Vessel = require("../models/Vessel");
const buffer_1 = require("buffer");
const dayjs_1 = __importDefault(require("dayjs"));
const findVesselsResolver = (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
    let vessels = yield Vessel.find();
    if (args.city !== "undefined") {
        vessels = vessels.filter((vessel) => {
            return vessel.location === args.city;
        });
    }
    if (args.type !== "undefined") {
        vessels = vessels.filter((vessel) => {
            return vessel.type === args.type;
        });
    }
    if (args.size !== "undefined") {
        vessels = vessels.filter((vessel) => {
            return vessel.size === args.size;
        });
    }
    vessels = vessels.filter((vessel) => ((0, dayjs_1.default)(args.pickupDay).isAfter((0, dayjs_1.default)(vessel.pickupDay)) ||
        (0, dayjs_1.default)(args.pickupDay).isSame((0, dayjs_1.default)(vessel.pickupDay))) &&
        ((0, dayjs_1.default)(args.returnDay).isBefore((0, dayjs_1.default)(vessel.returnDay)) ||
            (0, dayjs_1.default)(args.returnDay).isSame((0, dayjs_1.default)(vessel.returnDay))));
    const newVessels = vessels.map((vessel) => {
        const stringifiedPictures = [
            { data: buffer_1.Buffer.from(vessel.pictures[0].data).toString("base64") },
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
    }
    else if (args.sort === sortCriterions[1].title) {
        newVessels.reverse();
        return newVessels.slice(startIndex, endIndex);
    }
    else if (args.sort === sortCriterions[2].title) {
        newVessels.sort((a, b) => {
            if (a.pricePerDay > b.pricePerDay)
                return 1;
            else if (a.pricePerDay < b.pricePerDay)
                return -1;
            else {
                return 0;
            }
        });
        return newVessels.slice(startIndex, endIndex);
    }
    else if (args.sort === sortCriterions[3].title) {
        newVessels.sort((a, b) => {
            if (a.pricePerDay > b.pricePerDay)
                return -1;
            else if (a.pricePerDay < b.pricePerDay)
                return 1;
            else {
                return 0;
            }
        });
        return newVessels.slice(startIndex, endIndex);
    }
    else if (args.sort === sortCriterions[4].title) {
        newVessels.sort((a, b) => {
            if (a.pricePerWeek > b.pricePerWeek)
                return 1;
            else if (a.pricePerWeek < b.pricePerWeek)
                return -1;
            else {
                return 0;
            }
        });
        return newVessels.slice(startIndex, endIndex);
    }
    else if (args.sort === sortCriterions[5].title) {
        newVessels.sort((a, b) => {
            if (a.pricePerWeek > b.pricePerWeek)
                return -1;
            else if (a.pricePerWeek < b.pricePerWeek)
                return 1;
            else {
                return 0;
            }
        });
        return newVessels.slice(startIndex, endIndex);
    }
});
exports.findVesselsResolver = findVesselsResolver;
const vesNum = (parent, args) => __awaiter(void 0, void 0, void 0, function* () { });
exports.vesNum = vesNum;
