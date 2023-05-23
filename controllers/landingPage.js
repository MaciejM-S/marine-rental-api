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
const errorHandler = (errorCode, next) => {
    const newError = new Error();
    newError.statusCode = errorCode;
    console.log(newError);
    next(newError);
};
exports.firstVessels = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const firstVessels = yield Vessel.find({ isFirstVessel: true });
    res.send({ vessels: firstVessels });
});
exports.startServer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({ message: "server ready" });
});
exports.isServerRunning = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({
        message: "running",
    });
});
