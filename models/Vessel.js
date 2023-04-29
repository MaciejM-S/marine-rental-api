"use strict";
const mongoose = require("mongoose");
const vesselSchema = new mongoose.Schema({
    user: { type: String, required: true, ref: "user" },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    pictures: [{ data: { type: Buffer } }],
    pricePerDay: { type: Number },
    pricePerWeek: { type: Number },
    pickupDay: { type: String },
    returnDay: { type: String },
    isFirstVessel: { type: Boolean, default: false },
});
const Vessel = mongoose.model("vessel", vesselSchema);
module.exports = Vessel;
