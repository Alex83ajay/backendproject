const express = require("express");
const { addToCart, getUserCart, updateCart } = require("../controllers/cartController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post("/addcart", verifyToken, addToCart);         // Add product to cart
router.get("/getcart/userId", verifyToken, getUserCart); // Get user cart
router.put("/updatecart", verifyToken, updateCart);      // Update cart item

module.exports = router;
