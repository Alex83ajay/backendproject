const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwt_secret = process.env.JWT_SECRET ||  "iamfoodballlover!"




const generateToken = async (user) => {  //user id /1
const token = await jwt.sign({ id: user._id, email: user.email, role: user.role}, jwt_secret, { expiresIn: "7d"  });  //user id vachi create panrom/jwt.sign(payload, secret, options)ல,

    return token;
}

//setting cookies


// Send token in cookie
// const sendToken = (user, res) => {
//   const token = generateToken(user._id);

//   const options = {
//     expires: new Date(Date.now() + COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000), // convert days → ms
//     httpOnly: true, // JS cannot access this cookie
//     secure: process.env.NODE_ENV === "production", // send only on HTTPS in production
//     sameSite: "Strict" // prevent CSRF
//   };

//   res.status(200)
//     .cookie("token", token, options)
//     .json({
//       success: true,
//       token,
//       user
//     });
// };



const verifyToken = async(req, res, next) => {
    // return async (req, res, next) =>{
    try {
        const tokenHeader = req.headers.authorization;
        if (!tokenHeader.startsWith("Bearer ")) {
            return res.status(401).send({ message: "Invalid Token" })
        }
        const token = tokenHeader.split(" ")[1];
        if (!token) {
               
            return res.status(404).send({ message: "Token not found" });  //Token header-ல கிடைக்கல. //db la ila
        }
     
        const decode =await jwt.verify(token, jwt_secret);//ஒரு JWT token சரியானதா, expire ஆகலையா என்று check பண்ணும்.

        if (!decode) {
            return res.status(401).send({ message: "You are not have access" })//"decode எதுவும் வரல, அதாவது token valid இல்ல."
        }  //unathrozized

        req.user = decode;
        next();       
    } catch (error) {
        return res.status(401).send({ message: "token Error" })
    }
}

// ================= ROLE BASED AUTHORIZATION =================
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        console.log(req.user.role);
      return res
        .status(403)
        .json({ message: `Role (${req.user.role}) is not allowed to access this resource` });

    }
    next();
  };         
};                               

module.exports = {
    generateToken,
    verifyToken,
    authorizeRoles
   
}
