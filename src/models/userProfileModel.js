const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to your user model
      required: true,
    },
    username: {
      type: String,
      required: [true, "Please enter name"],
    },
    phone: {
      type: String,
      default: "",
    },
    dob: {                          
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ProfileModel = mongoose.model("Profile", profileSchema);
module.exports = ProfileModel;
