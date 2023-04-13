const mongoose = require("mongoose");

const validateEmail = (email) => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    min: 6,
    required: "Password is required",
  },
  events: {
    type: [String],
    default: [],
    required: "Events field is required",
  },
  events_hosted: {
    type: [String],
    default: [],
    required: "Events hosted field is required",
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("users", userSchema);
