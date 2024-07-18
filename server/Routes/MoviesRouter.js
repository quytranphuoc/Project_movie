import express from "express";
import * as moviesController from "../Controllers/MoviesController.js";

import { protect, admin } from "../middlewares/Auth.js";

const router = express.Router();
//**************Public ROUTES*************
router.post("/import", moviesController.importMovies);
router.get("/", moviesController.getMovies);
router.get("/:id", moviesController.getMoviesById);
router.get("/rated/top", moviesController.getTopRatedMovies);
router.get("/random/all", moviesController.getRandomMovies);

//*************PRIVATE ROUTES************
router.post("/:id/reviews", protect, moviesController.createMovieReview);

//*********** ADMIN ROUTES************* */

router.put("/:id", protect, admin, moviesController.updateMovies);
router.delete("/:id", protect, admin, moviesController.createMovieReview);
router.delete("/", protect, admin, moviesController.deleteAllMovies);
router.post("/", protect, admin, moviesController.createMovie);

export default router;
