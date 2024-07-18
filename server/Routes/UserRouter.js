import express from "express";
import {
  addLikedMovie,
  changeUserPassword,
  deleteLikeMovies,
  deleteUserProfile,
  deleteUser,
  getLikedMovies,
  getUsers,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../Controllers/UserController.js";
import { protect, admin } from "../middlewares/Auth.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);

//PRIVATE ROUTES
router.put("/", protect, updateUserProfile);
router.delete("/", protect, deleteUserProfile);
router.put("/password", protect, changeUserPassword);
router.get("/favorites", protect, getLikedMovies);
router.post("/favorites", protect, addLikedMovie);
router.post("/favorites", protect, deleteLikeMovies);

//Admin ROUTES
router.get("/", protect, admin, getUsers);
router.delete(":/id", protect, admin, deleteUser);
export default router;
