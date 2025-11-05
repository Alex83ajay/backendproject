const express=require('express')
const router=express.Router();
const authController=require('../controllers/authController')
const {verifyToken,authorizeRoles}=require('../middleware/auth');
const upload=require("../middleware/fileStorage")
const profileController=require("../controllers/profileController")





router.post("/register",authController.userRegisterController );
router.post("/login",authController.userLoginController);
router.get("/profile",verifyToken, authController.showProfileController);
router.post("/logout", verifyToken,authController.logoutController );
router.post("/forgotpassword", authController.forgotpassword);
router.post("/Resetpassword", authController.Resetpassword);
router.post("/changePassword",verifyToken,authController.changePasswordController)
// router.put("/updateProfile",verifyToken,authController.updateProfileController)

// admin
router.post("/adminRegister",authController.adminRegisterController)
router.post("/adminlogin",authController.adminLoginController)       

router.get("/getUserProfile",verifyToken, profileController.getProfile) 
router.post(
  "/createProfile",
  verifyToken,
  upload.single("image"), // 🟢 this line is MANDATORY
  profileController.createProfile
);

router.put("/updateProfile", verifyToken, upload.single("image"),profileController.updateProfile);
           
    

// admin         

router.get("/admin/getAllUsers",verifyToken,authorizeRoles("admin"),authController.getAllUsers);
router.get("/admin/getUserById/:id",verifyToken,authorizeRoles("admin"),authController. getUserById);
router.put("/admin/updateUserRole/:id",verifyToken,authorizeRoles("admin"),authController. updateUserRole);
router.delete("/admin/deleteUser/:id",verifyToken,authorizeRoles("admin"),authController. deleteUser);

module.exports=router
     
                                          