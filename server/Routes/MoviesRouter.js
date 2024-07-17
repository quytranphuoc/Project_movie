import express from "express";
import { importMovies } from "../Controllers/MoviesController.js";

import { protect, admin } from "../middlewares/Auth.js";

const router = express.Router();

router.post("/import", importMovies);

export default router;
    