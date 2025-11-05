const ProfileModel = require("../models/userProfileModel");

// ✅ Get Profile
const getProfile = async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({ user: req.user.id }).select("-__v");

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.json({ success: true, user: profile });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Create Profile
const createProfile = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ success: false, message: "No data received" });
    }

    const { username, phone, dob, gender, address } = req.body;

    if (!username || !phone || !dob || !gender || !address) {
      return res.status(400).json({ success: false, message: "Profile data missing" });
    }

    const parsedAddress =
      typeof address === "string" ? JSON.parse(address) : address;

    const profileData = {
      user: req.user.id,
      username,
      phone,
      dob,
      gender,
      address: parsedAddress,
      image: req.file ? req.file.filename : "",
    };

    const newProfile = await ProfileModel.create(profileData);
    return res.status(201).json({ success: true, user: newProfile });
  } catch (err) {
    console.error("Create Profile Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update Profile
const updateProfile = async (req, res) => {
  try {
    const { username, phone, dob, gender, address } = req.body;
    const parsedAddress =
      typeof address === "string" ? JSON.parse(address) : address;

    const updateData = { username, phone, dob, gender, address: parsedAddress };

    if (req.file) updateData.image = req.file.filename;

    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true, upsert: false }
    ).select("-__v");

    if (!updatedProfile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedProfile,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: err.message,
    });
  }
};

module.exports = { getProfile, createProfile, updateProfile };
