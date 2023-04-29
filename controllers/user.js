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
const moment = require("moment");
const sharp = require("sharp");
const bcrypt = require("bcrypt");
const generateAuthToken = require("./../helperFunctions/genrateToken");
const User = require("./../models/User");
const errorHandler = (errorCode, next) => {
    const newError = new Error();
    newError.statusCode = errorCode;
    next(newError);
};
exports.signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let newToken;
    const user = yield User.findOne({ email: req.body.email });
    if (!user) {
        res.send({ message: "notLogged" });
    }
    else {
        try {
            yield bcrypt.compare(req.body.password, user.password, function (err, result) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.send({ err, message: "notLogged" });
                    }
                    if (result) {
                        newToken = yield generateAuthToken(user._id.toString(), user);
                        yield user.save();
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
                    }
                    else {
                        res.send({ message: "notLogged" });
                    }
                });
            });
        }
        catch (e) {
            if (e instanceof Error) {
                if (e.name === "TypeError") {
                    return res.send({ message: "notLogged" });
                }
            }
        }
    }
});
exports.signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const emailDup = yield User.findOne({ email: req.body.email });
    if (emailDup) {
        return res.status(403).send({ error: "email exists" });
    }
    else {
        try {
            req.body.password = yield bcrypt.hash(req.body.password, 8);
            const user = new User({
                email: req.body.email.trim().toLowerCase(),
                password: req.body.password,
                info: {
                    firstName: req.body.fname.trim().toLowerCase(),
                    lastName: req.body.lname.trim().toLowerCase(),
                },
            });
            try {
                const newToken = yield generateAuthToken(user._id.toString(), user);
                yield user.save();
                res.status(200).send({
                    message: "created",
                    newToken,
                    email: user.email,
                    _id: user._id,
                    firstName: user.info.firstName,
                    lastName: user.info.lastName,
                });
            }
            catch (error) {
                let message = "Unknown Error";
                if (error instanceof Error)
                    message = error.message;
            }
            yield user.save();
        }
        catch (e) {
            errorHandler(500, next);
        }
    }
});
exports.authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({
        user: req.user,
        message: "authorizated",
    });
});
exports.logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const index = req.user.tokens.findIndex((token) => token.token === req.token);
        req.user.tokens.splice(index, 1);
        req.user.save();
        res.send({ message: "loggedOut" });
    }
    catch (e) {
        errorHandler(500, next);
    }
});
exports.updateAvatar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.file) {
            console.log('avatar updated');
            req.user.avatar.data = yield sharp(req.file.buffer)
                .resize({ width: 150 })
                .toBuffer();
            req.user.avatar.date = moment().format("MMM DD YYYY");
        }
        yield req.user.save();
        res.send({ message: 'succeded' });
    }
    catch (e) {
        errorHandler(500, next);
    }
    res.send();
});
exports.updateInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = req.body;
        req.user.info.firstName = req.body.firstName;
        req.user.info.lastName = req.body.lastName;
        req.user.info.telephone = req.body.telephone;
        req.user.save();
        res.send({ message: 'uploaded', info });
    }
    catch (e) {
        errorHandler(500, next);
    }
});
exports.updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield bcrypt.compare(req.body.currentPass, req.user.password, function (err, result) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    res.send({ err, message: "incorrect" });
                }
                else if (result) {
                    req.user.password = yield bcrypt.hash(req.body.currentPass, 8);
                    res.send({ message: 'updated' });
                }
                else {
                    res.send({ message: "incorrect" });
                }
            });
        });
    }
    catch (e) {
        if (e instanceof Error) {
            if (e.name === "TypeError") {
                return res.send({ message: "notLogged" });
            }
        }
    }
});
