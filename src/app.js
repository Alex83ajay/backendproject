// const express = require("express");
// const cors = require("cors");
// const errorMiddleWare = require("./middleware/error");
// const path = require("path");
// const http = require("http");

// // Routers
// const mainRouter = require("./routes/routes");
// const authRouter = require("./routes/auth");
// const orderRouter = require("./routes/order");
// const cartRouter = require("./routes/cartRoute");

// const app = express();

// // ✅ CORS multi-origin support (5173, 5174 both)
// app.use(cors({
//   origin: "*"
// }));

// console.log("✅ Cart router mounted at /api/cart");
// // ✅ Middleware
// app.use(express.json());


// app.get("/", (req, res) => {
//   res.send("Backend running on Vercel 🚀");
// });

// // app.use('/uploads', express.static('src/uploads'));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// // ✅ Routes with base path
// app.use("/api", mainRouter);
// app.use("/api/auth", authRouter);
// app.use("/api/orders", orderRouter);
// app.use("/api/cart", cartRouter);

// // ✅ Error middleware (after routes)
// app.use(errorMiddleWare);

// // ✅ Create server
// // const server = http.createServer(app);

// // module.exports = server;
// module.exports = app;















const express = require("express");
const cors = require("cors");
const path = require("path");
const errorMiddleWare = require("./middleware/error");

// Routers
const mainRouter = require("./routes/routes");
const authRouter = require("./routes/auth");
const orderRouter = require("./routes/order");
const cartRouter = require("./routes/cartRoute");

const app = express();

/* =====================================
   ✅ CORS (DEV SAFE – NO BLOCK)
===================================== */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* =====================================
   ✅ MIDDLEWARES
===================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================================
   ✅ TEST ROUTE
===================================== */
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* =====================================
   ✅ STATIC FILES
===================================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =====================================
   ✅ ROUTES
===================================== */
app.use("/api", mainRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cart", cartRouter);

/* =====================================
   ✅ ERROR HANDLER
===================================== */
app.use(errorMiddleWare);

module.exports = app;
