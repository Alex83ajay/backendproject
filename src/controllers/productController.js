
const userModel=require("../models/userModel")
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const productModel =require("../models/productModel")

const bcrypt = require('bcrypt');
const ErrorHandler=require("../utils/errorHandler")


const { search, filter, sort, paginate }=require('../utils/apiFeatures')


  // try {
    // Automatically attach logged-in user ID
 
    //req.user.id → login ஆன user-oda ID.

//req.body.user = req.user.id → அந்த user id-ஐ product-க்கு attach பண்ணுது.

//new productModel(req.body) → Product object create.

//save() → MongoDB-ல store.
//     req.body.user = req.user.id;       //product la user id attach.
//     const product = new productModel(req.body);
//     await product.save();

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       product,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error creating product",
//       error: error.message,
//     });


  // }
const productCreateController = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;

    const images = ['image1','image2','image3','image4','image5']
      .map(key => req.files[key] && req.files[key][0])
      .filter(file => file)
      .map(file => file.filename); // only filename

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestSeller: bestSeller === "true",
      sizes: JSON.parse(sizes),
      image: images,
      date: Date.now()
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



 
     

                    

const showProductIdController = async (req, res) => {            
    try {
        // const showUser = await UserModel.find(); //show the all data  
        // const showUser = await UserModel.findOne({ "title":"Learn Node.js"}); //find the matched data only   //query
        const id = req.params.id;
        //params   express.json la vanthatha  params la set panrom
        const showUser = await productModel.findById(id); // to find the data based on object Id or _id
         console.log(showUser,"dfghjkjhgfdsdfghjk")
        if (!showUser) {
           return next(new ErrorHandler("Product not found ",400))
        }

        res.status(200).send({ data: showUser })
    } catch (error) {
        res.status(500).send("Error when get users")
    }
}
          




const showproductController = async (req, res) => {     
     try {
    // const resultPerPage = 5; // per page 5 products
    // const productCount = await productModel.countDocuments();

    // let query = productModel.find();

    // // 🔍 Search
    // query = search(query, req.query);     

    // // 🎯 Filter
    // query = filter(query, req.query);

    // // ⚡ Sort
    // query = sort(query, req.query);

    // // 📑 Pagination
    // query = paginate(query, req.query, resultPerPage);    

    // finally execute query
//     const products = await query;

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       totalProducts: productCount,
//       products,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message,
//     });
       
       const products= await productModel.find({})
       res.json({success:true,products})

     }catch(err){
      console.log(err)
      res.json({success:false,message:err.message})

  }

}

   // const showUser = await UserModel.findOne({ "title":"Learn Node.js"}); //find the matched data only   //query
        // const id = req.params.id;
        //params   express.json la vanthatha  params la set panrom
        // const showUser = await UserModel.findById(id); // to find the data based on object Id or _id




const updateProductController = async (req, res) => {
    try {
        const { id } = req.query;
        const title = req.body;
        const updateUser = await productModel.findByIdAndUpdate(id, title, { new: true, runValidators: true });

        if (!updateUser) {
            return res.status(404).json({ success: false, message: "product not found" })
        }

        res.status(200).send({ data: updateUser })   //client ku
    } catch (error) {
        res.status(500).send("Error when update users")
    }
}




const deleteProductController = async (req, res) => {
    try {

        const { id } = req.params;
        console.log(id, 'id');
        const deleteUser = await productModel.findByIdAndDelete(id);
        if (!deleteUser) {
            return res.status(404).json({ success: false, message: "product not found" })
        }

        res.status(200).json({ success: true, message: "product deleted successfully" })
    } catch (error) {
        res.status(500).send("Error when delete users")
    }
}

// review


const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const review = {
      user: req.user.id, // login user id
      rating: Number(rating),
      comment,
    };

    const product = await productModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // check if user already reviewed
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user.id.toString()
    );

    if (isReviewed) {
      // update existing review
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user.id.toString()) {
          rev.comment = comment;
          rev.rating = Number(rating);
        }
      });
    } else {
      // add new review
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // calculate average rating
    product.ratings =
      product.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
      product.reviews.length;

    product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: isReviewed ? "Review updated" : "Review added",
      reviews: product.reviews,
      ratings: product.ratings,
      numOfReviews: product.numOfReviews,
    });
  } catch (error) {
    console.error("Review Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error when creating and updating review" });
  }
};


// Get all reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const product = await productModel.findById(req.query.id)
    
   

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
      numOfReviews: product.numOfReviews,
      averageRating: product.ratings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching reviews",
      error: error.message,
    });
  }
};


//delete review

const deletReview=async(req,res)=>{
  try {
    
         const product=await productModel.findById(req.query.productId);
         const productId = req.query.productId || req.body.productId || req.params.productId;
console.log("ProductId received:", productId);

         //filtering the review which does not match the deleting review id

         const reviews=product.reviews.filter(rev => {
       return rev._id.toString() !== req.query.id.toString()
         })

         //number of review

           const numOfReviews=reviews.length;
// finding the avarage with the filter review  /filter panathala tha avarge kandupudikanum
           let ratings=reviews.reduce((prev,curr) =>{
            return curr.rating + prev ;
           },0)/ reviews.length;
           ratings=isNaN(ratings)?0:ratings;
   //saving the product document
           await productModel.findByIdAndUpdate(req.query.productId,{
            reviews,
            numOfReviews,
            ratings
           })
           res.status(200).json({
            success:true
           })


  } catch (error) {
      res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}



// const registerUserDetailsController = async (req, res) => {
//     try {
//         const userData = req.body;
//         console.log("userdata",userData)
//         userData.image = req.file.fileName;
//         const storeData = new UserModel(userData);
//         await storeData.save();

//         return res.status(200).send({message:"Data uploaded successfully"});
//     } catch (error) {
//         return res.status(error.statusCode || 500).send({message: error.message ||"Error when regsitering user"})
//     }
// }   


//api  to get user Profile data



module.exports = {
    productCreateController,
    showproductController,           // ///muliple import panrom  
    updateProductController,
    deleteProductController,
    showProductIdController,
    //  registerUserDetailsController,



    // review
    createReview,
    getProductReviews,
    deletReview,


   


}