"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const express = require("express");
const router = new express.Router();
const cors = require("cors");
const vesselController = require("../controllers/vessel");
const authorization = require("../middleware/authorization");
router.use(cors());
router.use(express.json());
const uploadPictures = (0, multer_1.default)({
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
router.post("/addVessel", authorization, uploadPictures.array("image", 5), vesselController.addVessel);
router.get("/yourVessels", authorization, vesselController.yourVessels);
router.delete("/removeVessel/:id", authorization, vesselController.removeVessel);
router.get("/vessel-owner/:id", vesselController.vesselOwner);
router.get("/vessel-contact/:ownerId", vesselController.ownerContact);
router.get("/isFavorite/:vesselId", authorization, vesselController.isFavorite);
router.get("/handleFavorite/:vesselId/:currentState", authorization, vesselController.handleFavorite);
router.get("/getFavorites", authorization, vesselController.getFavorites);
router.post("/unlike/:vesselId", authorization, vesselController.unlike);
router.get("/checkIfFirst", authorization, vesselController.checkIfFirst);
module.exports = router;
