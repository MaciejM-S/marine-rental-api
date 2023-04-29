"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const express = require("express");
const router = new express.Router();
const cors = require("cors");
const userController = require("../controllers/user");
const authorization = require("../middleware/authorization");
router.use(cors());
router.use(express.json());
const uploadAvatar = (0, multer_1.default)({
    limits: {
        fileSize: 2000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|svg|jpeg)$/)) {
            return cb(new Error("please upload jpg"));
        }
        cb(null, true);
    },
});
router.post("/sign-up", userController.signUp);
router.post("/sign-in", userController.signIn);
router.get("/authenticate", authorization, userController.authenticate);
router.get("/logout", authorization, userController.logout);
router.post("/updateAvatar", authorization, uploadAvatar.single("image"), userController.updateAvatar);
router.post("/updateInfo", authorization, userController.updateInfo);
router.post("/updatePassword", authorization, userController.updatePassword);
module.exports = router;
