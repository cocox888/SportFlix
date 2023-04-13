const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  host: {
    type: String,
    required: true,
  },
  host_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: "Date is required",
  },
  max_players: {
    type: Number,
    required: "Max players required",
  },
  min_age: {
    type: Number,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  district: {
    type: String,
  },
  locatlity: {
    type: String,
  },
  location: {
    type: String,
    required: "Location name is reqired",
  },
  pinCode: {
    type: String,
  },
  sector: {
    type: String,
  },
  state: {
    type: String,
  },
  latitude: {
    type: Number,
    required: "Latitude is required",
  },
  longitude: {
    type: Number,
    required: "Longitude is required",
  },
  type: {
    type: String,
    required: "Game type is required",
  },
  description: {
    type: String,
    required: "Description is required",
  },
  participants: {
    type: [String],
  },
  loc: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});
eventSchema.index({ loc: "2dsphere" });
module.exports = mongoose.model("events", eventSchema);
