"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    info: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        telephone: {
            type: String,
        },
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token: { type: String },
        },
    ],
    avatar: {
        date: {
            type: String,
        },
        data: {
            type: Buffer,
        },
        description: {
            type: String,
        },
    },
    vessels: [{ vesselId: { type: String, ref: "vessel" } }],
    favorites: [{ type: String }],
    firstVessel: { type: Boolean, default: true },
});
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};
const User = mongoose_1.default.model("user", userSchema);
module.exports = User;
