// const mongoose=require("mongoose")

// const app=require("./app")
   
// require("dotenv").config()

// const mongodb_uri=process.env.MONGODB_URI || "mongodb+srv://aajay99732:Aajay99732@database.c3gzvze.mongodb.net/product";
// // const port=process.env.PORT || 5000 ;

// mongoose.connect(mongodb_uri)
// .then(() => {  
//     // server.listen(port, () => {
//     //     console.log(`Server is running on ${port}`);
//     // })          
//     console.log("MongoDB connected")   
// }).catch((err) => {      
//     console.log("Mongodb error", err)
// })   

//  //mongoose.connect(...).catch(...) pannaama vitinga na → unhandled promise rejection trigger aagum.
// // process.on('unhandledRejection',(err)=>{
// //     console.log(`Error:${err.message}`);
// //     console.log('shutting down the server due to unhandled rejection')
// //     server.close(()=>{
// //         process.exit(1)
// //     })
// // })
// // //Neenga a nu oru variable use pannirukeenga, but define panna illa.
// // process.on('uncaughtException',(err)=>{
// //     console.log(`Error:${err.message}`);
// //     console.log('shutting down the server due to uncaught rejection')
// //     server.close(()=>{
// //         process.exit(1)
// //     })
// // })

// // console.log(a)

// module.exports = app




const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

const mongodb_uri = process.env.MONGODB_URI;

mongoose
  .connect(mongodb_uri)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
