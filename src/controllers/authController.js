const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const { generateToken } = require("../middleware/auth");
const ErrorHandler = require("../utils/errorHandler")
const mail = require("../utils/mailservice");
const generateOtp = require("../utils/otpGeneration");

const userRegisterController = catchAsyncError(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Request body:", req.body);

    // ❌ Empty fields validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check existing user         
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "You are already registered" });
    }

    console.log("Before hashing password:", password);

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("After hashing password:", hashedPassword);

    // save user
    const userData = await new UserModel({
      username,
      email,
      password: hashedPassword, // hashed value stored
      // avatar,
    }).save();

    return res.status(201).json({
      message: "User register successfully",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error when register user",
      error: error.message,
    });
  }
});

const userLoginController = async (req, res) => {
  try {

    const { email, password } = req.body;  //destructuring

    console.log("👉 Email from body:", email);
    console.log("👉 Password from body:", password);

    if (!email || !password) {
      const error = new Error("Please enter the email & password");
      error.statusCode = 400;  //DB-ல அந்த user இல்லனா → 404./400 (Bad Request) → client தவறான data அனுப்பினான்./500 (Internal Server Error) → serverல code crash/bug.
      throw error;


    }

    // const existUser = await UserModel.findOne({ mobileNumber: mobileNumber });
    const existUser = await UserModel.findOne({ email: email });

    console.log("👉 User role from DB:", existUser.role);

    if (!existUser) {
      const error = new Error("You are not registered");
      error.statusCode = 404;  //DB-ல அந்த user இல்லனா → 404./400 (Bad Request) → client தவறான data அனுப்பினான்./500 (Internal Server Error) → serverல code crash/bug.
      throw error;
    }


    const comparePassword = await bcrypt.compare(password, existUser.password);

    console.log("Plain password from req:", password);
    console.log("Hashed password from DB:", existUser.password);


    // password → The plain text password you just typed in the login form (front end).

    // existUser.password → The hashed password stored in your database when the user signed up   //true or flse nu varum

    if (!comparePassword) {   //incorrect password user kudutha
      const error = new Error("Incorrect credentials");//Login செய்யாம data access பண்ணும்போது
      error.statusCode = 401;//Client authorization header இல்லாமல் /profile கேட்டா → 401.
      throw error;
    }


    const token = await generateToken(existUser);    //useroda id    2vathu




    // Send token as cookie
    // res.cookie("token", token, {
    //   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    //   httpOnly: true, // JS cannot access cookie
    //   // secure: process.env.NODE_ENV === "production", // send only on HTTPS
    //   // sameSite: "Strict" // prevent CSRF
    // });

    // // Send response
    // res.status(200).json({
    //   message: "User login successfully",
    //   token,   // optional: also return in JSON
    const user = {
      id: existUser._id,
      name: existUser.name,
      email: existUser.email,
    }
    // });



    return res.status(200).send({ message: "User login successfully", data: { token: token, user: user } });
  } catch (error) {
    return res.status(error.statusCode || 500).send({ message: error.message || "Error when login user" })
  }
};



const adminRegisterController = catchAsyncError(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Request body:", req.body);

    // ❌ Empty fields validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check existing user
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "You are already registered" });
    }

    console.log("Before hashing password:", password);

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("After hashing password:", hashedPassword);

    // save user
    const userData = await new UserModel({
      username,
      email,
      password: hashedPassword, // hashed value stored
      // avatar,
    }).save();

    return res.status(201).json({
      message: "User Data created successfully",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error when creating user",
      error: error.message,
    });
  }
});

const adminLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password, "jhgfdzxcvbjhbvcvbnnbv")

    // 1️⃣ Check if email exists
    const admin = await UserModel.findOne({ email: email });
    console.log(admin, "admin")
    if (!admin) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // 3️⃣ Check role
    if (admin.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // 4️⃣ Generate JWT token
    const token = await generateToken(admin);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        token,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const logoutController = (req, res) => {
  // JWT Bearer token-க்கு, server just success message
  res.status(200).json({
    success: true,
    message: "User logged out successfully."
  });
};


//forgot password
const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }
    const user = await UserModel.findOne({ email: email });
    console.log("u", user)
    if (!user) {
      return res.status(400).json({ message: 'If that email exists we sent an OTP' });
    }
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.otp = otp;
    user.otpExpiry = expiresAt;
    await user.save();
    try {
      await mail(email, otp);
    } catch (mailErr) {
      console.error('Error sending OTP email:', mailErr);
    }
    return res.status(200).send({ message: 'Otp sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
}
// reset password

const Resetpassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await UserModel.findOne({ email: email });
    console.log("user", user)
    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).send({ message: 'Invalid or expired OTP' });
    }

    if (otp !== user.otp) {
      return res.status(400).send({ message: 'Give correct otp' });

    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).send({ message: 'Invalid or expired OTP' });
    }

    // OTP valid - update password and clear otp
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return res.send({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
}



const changePasswordController = async (req, res) => {
  try {
    const userId = req.user.id;  // from middleware
    const { oldPassword, newPassword } = req.body;
    console.log("oldpassword", oldPassword)
    console.log("new password", newPassword)

    // Input check
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password required" });
    }

    // Find user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });

  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Update Profile Controller
const updateProfileController = async (req, res) => {
  try {
    // prepare update data
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    // ✅ If avatar file uploaded via multer
    // if (req.file) {
    //   newUserData.avatar = req.file.filename;
    // }

    // ✅ Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      newUserData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password"); // 🚀 Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};




const showProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const showUser = await UserModel.findById(userId).select({ password: 0 });  //password hide pani anuprom
    return res.status(200).send({ success: true, message: "User profile get successfully", data: showUser });
  } catch (error) {
    return res.status(error.statusCode || 500).send({ message: error.message || "Error when showing user" })
  }
}


// admin ......


// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE user role
const updateUserRole = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    }



    const updateUser = await UserModel.findByIdAndUpdate(
      req.params.id, newUserData, {
      new: true,
      runValidators: true,
    }
    ).select("-password");

    if (!updateUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user: updateUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// // ✅ Get user profile
// const getUserProfile = async (req, res) => {
//   try {
//     const user = await UserModel.findById(req.user.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     res.json({ success: true, user });
//   } catch (err) {
//     console.error("Profile Fetch Error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
// ✅ Update user profile
// const updateProfile = async (req, res) => {
//   try {
//     console.log("REQ.BODY:", req.body);
//     console.log("REQ.FILE:", req.file);

//     const { username, phone, address, dob, gender } = req.body;

//     if (!username || !phone || !address || !dob || !gender) {
//       return res.status(400).json({ success: false, message: "Data missing" });
//     }

//     const parsedAddress =
//       typeof address === "string" ? JSON.parse(address) : address;

//     const updateData = { username, phone, address: parsedAddress, dob, gender };
//     if (req.file) {
//       updateData.image = req.file.filename;
//     }

//     const updatedUser = await UserModel.findByIdAndUpdate(
//       req.user.id,
//       updateData,
//       { new: true }
//     ).select("-password");

//     return res.json({
//       success: true,
//       message: "Profile updated successfully",
//       user: updatedUser,
//     });
//   } catch (err) {
//     console.error("Profile Update Error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error updating profile",
//       error: err.message,
//     });
//   }
// };
  



module.exports = {
  userRegisterController,
  userLoginController,
  logoutController,
  forgotpassword,
  Resetpassword,
  changePasswordController,
  updateProfileController,
  showProfileController,

  // getUserProfile,
  // updateProfile,
  // admin
  adminRegisterController,
  adminLoginController,

  // admin
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
};
