const express = require('express');  //express import
const router = express.Router(); 
const productController = require('../controllers/productController');

const { verifyToken, authorizeRoles } = require("../middleware/auth");

const upload=require("../middleware/fileStorage")



// router.post("/admin/user",verifyToken,authorizeRoles("admin"),productController.productCreateController);   ////api name
router.post("/admin/user",verifyToken, upload.fields([{name:"image1",maxCount:1},{name:"image2",maxCount:1},{name:"image3",maxCount:1},{name:"image4",maxCount:1},{name:"image5",maxCount:1}]),productController.productCreateController);   ////api name

router.get("/showuserid/:id",productController.showProductIdController);  
router.get("/showuser",productController.showproductController);             

router.put("/updateuser/:id",verifyToken, productController.updateProductController);
// router.put("/updateuser", userController.updateUserController);

router.delete("/deleteuser/:id",verifyToken,productController.deleteProductController)
// router.delete("/deleteuser", userController.deleteUserController); 
  
 

// review   

router.put("/review/createReview", verifyToken, productController.createReview)
router.get("/reviews", productController.getProductReviews);
router.delete("/deleteReview", verifyToken,productController.deletReview);


module.exports = router;                     