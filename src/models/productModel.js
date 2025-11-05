const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
      maxLength: [100, "Product name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
    },
    description: {   
      type: String,
      required: [true, "Please enter product description"],
    },
   image: [
  {
    filename: { type: String, required: true }
  }
],

    category: {
      type: String,
      required: [true, "Please enter product category"],
      enum: {
        values: ["Men", "Women", "Kids"],
        message: "Please select a valid category",
      },
    },

    subCategory: {
      type: String,
      required: true,
    },

    sizes: {
      type: Array,
      required: true,
    },

    bestSeller: {
      type: String,
    },

    date: {
      type: Number,
      required: true,
    },
    
  },
  { timestamps: true }
);

// 👇 Register as "Product" (not "Products")
const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
