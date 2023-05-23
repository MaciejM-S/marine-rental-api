const express = require("express");
const router = new express.Router();
const cors = require("cors");
const landingPageController = require("../controllers/landingPage");
const authorization = require("../middleware/authorization");
router.use(cors());
router.use(express.json());


router.get("/startServer", landingPageController.startServer)
router.get("/firstVessels", landingPageController.firstVessels);
router.get("/isServerRunning", landingPageController.isServerRunning);

module.exports = router;
