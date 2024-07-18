import asyncHandler from "express-async-handler";
import User from "../Models/UserModels.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/Auth.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password, image } = req.body;
  try {
    const userExists = await User.findOne({ email });
    //check if user exits
    if (userExists) {
      res.status(400);
      throw new Error("User already exits");
    } // } else {

    // }
    const salt = await bcrypt.genSalt(10);
    const handedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      fullname,
      email,
      password: handedPassword,
      image,
      likedMovies: [], //1
      //   });
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        idAdmin: user.idAdmin,
        likedMovies: user.likedMovies, // 1
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    // }

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        idAdmin: user.idAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, email, image } = req.body;
  try {
    // }

    const user = await User.findById(req.user._id);
    if (user) {
      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      user.image = image || user.image;
      const updateUser = await user.save();
      res.json({
        _id: updateUser._id,
        fullName: updateUser.fullName,
        email: updateUser.email,
        image: updateUser.image,
        idAdmin: updateUser.idAdmin,
        token: generateToken(updateUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const deleteUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Admin user can't be deleted");
      }
      await user.remove();
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(400);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// const changeUserPassword = asyncHandler(async (req, res) => {
//   const { oldPassword, newPassword } = req.body;
//   try {
//     //find user in DB
//     const user = await User.findById(req.user._id);
//     //if user exits compare old password with hashed password  then update user password and save it   in DB
//     if (user && (await bcrypt.compare(oldPassword, user.password))) {
//       //  hash new password
//       const salt = await bcrypt.genSalt(10);
//       const handedPassword = await bcrypt.hash(newPassword, salt);
//       user.password = hashedPassword;
//       await user.save();
//       res.json({ message: "Password changed !!" });
//       //else send error message
//     } else {
//       res.status(401);
//       throw new Error("Invalid old password");
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    // Find user in DB
    const user = await User.findById(req.user._id);

    // If user exists, compare old password with hashed password then update user password and save it in DB
    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.json({ message: "Password changed !!" });
    } else {
      res.status(401);
      throw new Error("Invalid old password");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// const getLikeMovies = asyncHandler(async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate("likeMovies");
//     if (user) {
//       res.json(user.likeMovies);
//     } else {
//       res.status(404);
//       throw new Error("User not found");
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
const getLikedMovies = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "likedMovies",
      strictPopulate: false,
    });
    if (!user) {
      res.json(user.likedMovies);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// const addLikedMovie = asyncHandler(async (req, res) => {
//   const { movieId } = req.body;
//   try {
//     const user = await User.findById(req.user._id);
//     if (user) {
//       // Array.isArray(user.likeMovies) &&
//       if (user.likedMovies.includes(movieId)) {
//         res.status(400);
//         throw new Error("Movie already liked");
//       }
//       user.likedMovies.push(movieId);
//       await user.save();
//       res.json(user.likeMovies);
//       //
//     } else {
//       res.status(404);
//       throw new Error("Movies not found");
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

const addLikedMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Kiểm tra xem likedMovies có phải là mảng không
      if (!Array.isArray(user.likedMovies)) {
        user.likedMovies = [];
      }

      // Nếu movieId đã tồn tại trong likedMovies, trả về lỗi
      if (user.likedMovies.includes(movieId)) {
        res.status(400);
        throw new Error("Movie already liked"); 
      }

      // Thêm movieId mới vào mảng likedMovies của user
      user.likedMovies.push(movieId);
      await user.save();

      res.json(user.likedMovies);
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const deleteLikeMovies = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.likedMovies = [];
      await user.save();
      res.json({ message: "All liked movies deleted successfully" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// const deleteUser = asyncHandler(async (req, res) => {
//   try {
//     const user = await User.findById(req.params._id);
//     if (user) {
//       if (user.isAdmin) {
//         res.status(400);
//         throw new Error("Can't delete admin user");
//       }
//       await user.remove();
//       res.json({ message: "User deleted successfully" });
//     } else {
//       res.status(404);
//       throw new Error("User not found");
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
const deleteUser = asyncHandler(async (req, res) => {
  try {
    // Find the user by _id
    const user = await User.findById(req.params._id);

    // Check if user exists
    if (user) {
      // Check if user is an admin
      if (user.isAdmin) {
        res.status(400); // Bad request status
        throw new Error("Can't delete admin user"); // Throw an error
      }

      // Remove the user
      await user.remove();
      res.json({ message: "User deleted successfully" }); // Send success response
    } else {
      // If user not found, send 404 error
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    // Catch any errors that occur during the process
    res.status(400).json({ message: error.message }); // Send error response
  }
});

export {
  registerUser,
  loginUser,
  updateUserProfile,
  deleteUserProfile,
  changeUserPassword,
  getLikedMovies,
  addLikedMovie,
  deleteLikeMovies,
  getUsers,
  deleteUser,
};
