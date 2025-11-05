const express = require("express");
const cors = require("cors");
const errorMiddleWare = require("./middleware/error");
const path = require("path");
const http = require("http");

// Routers
const mainRouter = require("./routes/routes");
const authRouter = require("./routes/auth");
const orderRouter = require("./routes/order");
const cartRouter = require("./routes/cartRoute");

const app = express();

// ✅ CORS multi-origin support (5173, 5174 both)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true, // allow cookies/headers
  })
);
console.log("✅ Cart router mounted at /api/cart");
// ✅ Middleware
app.use(express.json());

// app.use('/uploads', express.static('src/uploads'));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ✅ Routes with base path
app.use("/api", mainRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cart", cartRouter);

// ✅ Error middleware (after routes)
app.use(errorMiddleWare);

// ✅ Create server
const server = http.createServer(app);

module.exports = server;
