import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const express = require("express");
const router = new express.Router();
const cors = require("cors");
const vesselController = require("../controllers/vessel");
const authorization = require("../middleware/authorization");
router.use(cors());
router.use(express.json());

const uploadPictures = multer({
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    if (!file.originalname.match(/\.(jpg|png|svg|jpeg)$/)) {
      return cb(new Error("please upload jpg"));
    }
    cb(null, true);
  },
});

router.post(
  "/addVessel",
  authorization,
  uploadPictures.array("image", 5),
  vesselController.addVessel
);

router.get("/yourVessels", authorization, vesselController.yourVessels);

router.delete(
  "/removeVessel/:id",
  authorization,
  vesselController.removeVessel
);

router.get("/vessel-owner/:id", vesselController.vesselOwner);

router.get("/vessel-contact/:ownerId", vesselController.ownerContact);

router.get("/isFavorite/:vesselId", authorization, vesselController.isFavorite);

router.get(
  "/handleFavorite/:vesselId/:currentState",
  authorization,
  vesselController.handleFavorite
);

router.get("/getFavorites", authorization, vesselController.getFavorites);

router.post("/unlike/:vesselId", authorization, vesselController.unlike);

router.get("/checkIfFirst", authorization, vesselController.checkIfFirst);

module.exports = router;
