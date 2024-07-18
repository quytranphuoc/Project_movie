// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { connectDB } from "./config/db.js";
// import userRouter from "./Routes/UserRouter.js"
// import { errorHandler } from "./middlewares/errorMiddleware.js";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());
// //connect db
// connectDB();
// //Main route
// app.get("/", (req, res) => {
//   res.send("API is running ...");
// });
// //other routes
// app.use("/api/users", userRouter)
// //error handling middleware

// app.use(errorHandler)

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running in http://localhost/${PORT}`);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRouter from "./Routes/UserRouter.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import moviesRouter from "./Routes/MoviesRouter.js";
import categoriesRouter from "./Routes/CategoriesRouter.js";
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Database connection
connectDB();

// Main route
app.get("/", (req, res) => {
  res.send("API is running ...");
});

// Other routes
app.use("/api/users", userRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/categories", categoriesRouter);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
