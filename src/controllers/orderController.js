


// //create new order
// const Order=require('../models/orderModel')
// const product=require('../models/productModel')

// // POST /api/order
//  const createOrder = async (req, res) => {
//   try {
//     const { shippingInfo, orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentInfo} = req.body;

//     const order = await Order.create({
//       shippingInfo,
//       orderItems,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice,              
//       paymentInfo,
//       user: req.user.id,
//       paidAt: Date.now(),
      
//     });

//     res.status(201).json({ success: true, order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // GET /api/order/:id
//  const getSingleOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate("user", "name email");  //user la iruka feild or collection la iruka name and email konduvarum

//     if (!order) return res.status(404).json({ success: false, message: "Order not found" });

//     res.json({ success: true, order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// //user see there order

//  const getMyOrders = async (req, res) => {
    

//   try {
    
//     const order = await Order.find({user:req.user.id}) ;
 

//     if (!order) return res.status(404).json({ success: false, message: "Order not found" });

//     res.json({ success: true, order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// // 🔹 Get All Orders (Admin)
// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().populate("user", "name email");
//     let totalAmount=0;
    
//     orders.forEach(order => {
//           totalAmount += order.totalPrice
//     });

//     res.status(200).json({ success: true, count: orders.length,totalAmount, orders });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // 🔹 Update Order Status (Admin only)
//  const updateOrderStatus = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }

//     if (order.orderStatus === "Delivered") {
//       return res.status(400).json({
//         success: false,
//         message: "This order has already been delivered"
//       });
//     }

//     // Update stock only when order is marked as "shipped"
//      // Updating the product stock of each order item
//    if (req.body.orderStatus === "Delivered") {
//   for (const item of order.orderItems) {
//     await updateStock(item.product, item.quantity);
//   }
//   order.deliveredAt = Date.now();
// }

//     order.orderStatus = req.body.orderStatus;

//     if (req.body.status === "delivered") {
//       order.deliveredAt = Date.now();
//     }

//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order status updated successfully",
//       order
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // helper function to update stock
// const Product = require('../models/productModel'); // Top of file

// async function updateStock(productId, quantity) {
//   // 1️⃣ Database-ல இருந்து அந்த product-ஐ எடுக்கிறது
//   const dbProduct = await Product.findById(productId);

//   if (!dbProduct) {
//     console.error(`❌ Product not found for ID: ${productId}`);
//     return; // crash prevent
//   }

//   // 2️⃣ அந்த product stock-ஐ, order quantity க்கு குறைக்கிறது
//   dbProduct.stock -= quantity;

//   // 3️⃣ Updated stock-ஐ மீண்டும் DB-க்கு save செய்கிறது
//   await dbProduct.save({ validateBeforeSave: false });

//   console.log(`✅ Stock updated for ${dbProduct.name}, New Stock: ${dbProduct.stock}`);
// }


// //Product.findById("p123") → Laptop document கிடைக்கும் (stock = 10).

// //product.stock = 10 - 2 → stock = 8.

// //product.save() → DB-ல stock = 8 save ஆகும்.

// // DELETE /api/order/:id
// const deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }

//     await order.deleteOne(); // MongoDB ல order remove பண்ணும்

//     res.status(200).json({
//       success: true,
//       message: "Order deleted successfully"
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };



// module.exports={
//     createOrder,
//     getSingleOrder,
//     getMyOrders,
//     getAllOrders,
//     updateOrderStatus,
//     deleteOrder
// }

const orderModel=require('../models/orderModel')
const userModel = require('../models/userModel')
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // put your secret key in .env
const razorpay=require("razorpay");
const { options } = require('../routes/order');

//global variables

const currency="inr"
const deliveryCharge=10
const razorpayInstance=new razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET,
})

// my project dress shop


 //placing order using cod method  


const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;

    const orderData = {
      userId: req.user.id, // ✅ from token
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date:Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


 //placing order using stripe method 


const placeOrderStripe=async(req,res)=>{
      try {
         const { items, amount, address } = req.body;
         const {origin}=req.headers

      const orderData = {
      userId: req.user.id, // ✅ from token
      items,
      address,
      amount,
      paymentMethod: "stripe",
      payment: false,
      date:Date.now()
    };

       const newOrder = new orderModel(orderData);
    await newOrder.save();
     
    // we can execute stripe payment

 const line_items = items.map(item => ({
  price_data: {
    currency: currency,
    product_data: {
      name: item.name || "Product",  // ✅ fallback
    },
    unit_amount: Math.round(item.price * 100), // ✅ int only
  },
  quantity: item.quantity || 1,
}));


    line_items.push({
      price_data:{
        currency:currency,
        product_data:{
          name:"Delivery Charges"
        },
        unit_amount:deliveryCharge*100
      },
      quantity:1
    })

    const session=await stripe.checkout.sessions.create({
      success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode:'payment',
    })

      res.json({success:true,session_url:session.url})

      } catch (error) {
      console.log(error);
    res.json({ success: false, message: error.message });
      }
}


//verifystripe


const verifyStripe=async(req,res)=>{
        const {orderId,success} =req.body

        try {
          if(success === "true"){
               await orderModel.findByIdAndUpdate(orderId,{payment:true})
              await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });

               res.json({success:true})

          }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
          }
        } catch (error) {
          console.log(error);
          res.json({ success: false, message: error.message });
        }
}

 //placing order using Razorpay method 


const placeOrderRazorpay=async(req,res)=>{
        try {
      const { items, amount, address } = req.body;
      const {origin}=req.headers

      const orderData = {
      userId: req.user.id, // ✅ from token
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date:Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const option={
      amount:amount*100,
      currency:currency.toUpperCase(),
      receipt:newOrder._id.toString()
    }

    await razorpayInstance.orders.create(option,(error,order)=>{
      if(error){
       console.log(error)
       return res.json({success:false,message:error})
      }
      res.json({success:true,order})
    })
        } catch (error) {
          console.log(error)
          res.json({success:false,message:error.message})
        }
  
} 

const verifyRazorpay=async(req,res)=>{
         try {
          const {razorpay_order_id}=req.body

         const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)

       if (orderInfo.status === "paid") {
          await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
          await userModel.findByIdAndDelete(req.user.id,{cartData:{}})
          res.json({success:true,message:"Payment Successfull"})
       }else{
        res.json({success:false,message:"Payment Failed"})
       }

         } catch (error) {
            console.log(error)
          res.json({success:false,message:error.message})
         }
}

//All orders data for admin panel

const allOrders = async (req, res) => {
  try {
    // Populate productId to get product name, price, etc.
    const orders = await orderModel.find({})
      .populate("items.productId", "name price"); // ✅ Populate only needed fields

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



//user order data for frontend

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id })
      .populate("items.productId", "name image price"); // only bring needed fields

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



//update order status from admin panel

const updateStatus =async(req,res)=>{
  try{
    const {orderId,status} =req.body
    await orderModel.findByIdAndUpdate(orderId,{status})
    res.json({success:true,message:"Status Updated"})
  }    
catch(error){
   console.error(error);
    res.status(500).json({ success: false, message: error.message });
}
} 

module.exports={
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay
}



