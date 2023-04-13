const string = require("@hapi/joi/lib/types/string");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender_name: { type: String },
  sender_id: { type: String },
  date: { type: String },
  time: { type: String },
  message: { type: String },
});

const chatSchema = new mongoose.Schema({
  room_id: {
    type: String,
    required: "room id is required",
  },
  host_id: {
    type: String,
    required: "host id is required",
  },
  name: {
    type: String,
    required: "room name is required",
  },
  participants: {
    type: [String],
    required: "participants is required",
  },
  messages: {
    type: [messageSchema],
  },
  date: {
    type: String,
  },
  type: {
    type: String,
  },
});
module.exports = mongoose.model("chat", chatSchema);
