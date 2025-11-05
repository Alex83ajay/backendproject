const userModel = require("../models/userModel");

// Add product to user cart


// Add product to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // get from token
    const { itemId, sizes } = req.body; // sizes is an array now

    if (!itemId || !sizes || sizes.length === 0) {
      return res.status(400).json({ success: false, message: "Item ID and sizes required" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};

     if (cartData[itemId]) {
      cartData[itemId][sizes] = (cartData[itemId][sizes] || 0) + 1;
    } else {
      cartData[itemId] = { [sizes]: 1 };
    }

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });


      
    res.json({ success: true, message: "Added to cart", cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Update user cart
const updateCart = async (req, res) => {
  try {
    const { itemId, sizes, quantity } = req.body;

    // ✅ use user id from token, not from frontend
    const userData = await userModel.findById(req.user.id);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId][sizes] = quantity; // update quantity
    } else {
      return res.status(400).json({ success: false, message: "Item not in cart" });
    }

    await userModel.findByIdAndUpdate(req.user.id, { cartData }, { new: true });

    res.json({ success: true, message: "Cart updated", cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user cart
const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;  // jwt decode la iruntha userId
    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addToCart, updateCart, getUserCart };
