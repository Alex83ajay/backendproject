const express=require('express')
const router=express.Router();

const {verifyToken,authorizeRoles}=require('../middleware/auth');


// const {
//   createOrder,
//   getSingleOrder,
//   getMyOrders,
//   getAllOrders, //admin
//   updateOrderStatus,
//   deleteOrder
// } = require("../controllers/orderController");

// router.post("/order/new", verifyToken, createOrder);              // Create new order
// router.get("/order/getSingleOrder/:id", verifyToken, getSingleOrder);            // Get single order
// router.get("/order/getMyOrders", verifyToken,  getMyOrders);            // Get my order

// //admin    
// router.get("/order/getAllOrders", verifyToken, authorizeRoles("admin"), getAllOrders);    // Admin: get all orders
// router.put("/order/updateOrderStatus/:id", verifyToken, authorizeRoles("admin"), updateOrderStatus);  // Admin: update order status
// router.delete('/order/deleteOrder/:id', verifyToken, authorizeRoles('admin'), deleteOrder);
// module.exports = router;


const {
 placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay
} = require("../controllers/orderController");

// router.post("/order/new", verifyToken, createOrder);              // Create new order
// router.get("/order/getSingleOrder/:id", verifyToken, getSingleOrder);            // Get single order
// router.get("/order/getMyOrders", verifyToken,  getMyOrders);            // Get my order

//admin    features
router.get("/order/allOrders", verifyToken,authorizeRoles("admin"), allOrders);    // Admin: get all orders
router.put("/order/updatestatus", verifyToken,authorizeRoles("admin"), updateStatus);  // Admin: update order status



// payment feauters

router.post("/placeOrder", verifyToken, placeOrder);              // Create new order
router.post("/stripe", verifyToken, placeOrderStripe);  
 router.post("/razorpay", verifyToken, placeOrderRazorpay);        

// user features

router.get("/userOrders", verifyToken,  userOrders);


//verify payment


router.post("/verifyPayment",verifyToken,verifyStripe)
router.post("/verifyRazorpay",verifyToken,verifyRazorpay)


module.exports = router;      