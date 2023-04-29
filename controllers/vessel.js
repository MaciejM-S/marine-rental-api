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
Object.defineProperty(exports, "__esModule", { value: true });
const Vessel = require("./../models/Vessel");
const User = require("./../models/User");
const sharp = require("sharp");
const errorHandler = (errorCode, next) => {
    const newError = new Error();
    newError.statusCode = errorCode;
    console.log(newError);
    next(newError);
};
exports.addVessel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return errorHandler(404, next);
    }
    const vessel = req.body;
    let vesselPictures = [];
    if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
            const buffer = yield sharp(req.files[i].buffer)
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
        yield newVessel.save();
        req.user.firstVessel = false;
        req.user.save();
        res.send({ message: "created" });
    }
    else if (vessel.editedVessel) {
        const editedVessel = yield Vessel.findOne({ _id: vessel.editedVessel });
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
        yield editedVessel.save();
        res.send({ message: "updated" });
    }
});
exports.yourVessels = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let userVessels = yield Vessel.find({ user: req.user._id.toString() });
    userVessels.map((vessel) => {
        vessel.pictures = [vessel.pictures[0]];
    });
    res.send(userVessels);
});
exports.removeVessel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vessel = yield Vessel.deleteOne({ _id: req.params.id });
    res.send({ message: "removed" });
});
exports.vesselOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ves = yield Vessel.findOne({ _id: req.params.id });
    res.send(ves);
});
exports.ownerContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.ownerId === "undefined") {
        res.send({ message: "undefined" });
    }
    else {
        const owner = yield User.findOne({ _id: req.params.ownerId });
        const contactCard = {
            firstName: owner.info.firstName,
            lastName: owner.info.lastName,
            telephone: owner.info.telephone,
            email: owner.email,
            avatar: owner.avatar,
        };
        res.send({ contactCard });
    }
});
exports.isFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user.favorites) {
        res.send({ message: false });
    }
    else {
        if (req.user.favorites.find((vessel) => vessel === req.params.vesselId)) {
            res.send({ message: true });
        }
        else {
            res.send({ message: false });
        }
    }
});
exports.handleFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ _id: req.user._id });
    if (req.params.currentState === "true") {
        const index = req.user.favorites.findIndex((vessel) => vessel === req.params.vesselId);
        if (index === -1) {
            res.send({ message: "changed" });
        }
        else {
            user.favorites = req.user.favorites.filter((vessel) => vessel !== req.params.vesselId);
            yield user.save();
        }
        res.send({ message: "changed" });
    }
    else if (req.params.currentState === "false") {
        user.favorites.push(req.params.vesselId);
        yield user.save();
        res.send({ message: "changed" });
    }
});
exports.getFavorites = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vesselsIds = req.user.favorites;
    if (vesselsIds) {
        const vessels = [];
        for (let i = 0; i < vesselsIds.length; i++) {
            const ves = yield Vessel.findOne({ _id: vesselsIds[i] });
            if (ves !== null)
                vessels.push(ves);
        }
        res.send({ data: vessels });
    }
    else {
        res.send({ data: "noVessels" });
    }
});
exports.unlike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.user.favorites = req.user.favorites.filter((vesId) => req.params.vesselId !== vesId);
    req.user.save();
    res.send({ message: "unliked" });
});
exports.checkIfFirst = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const isFirst = req.user.firstVessel;
    res.send({ message: isFirst });
});
