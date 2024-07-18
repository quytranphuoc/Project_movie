import Categories from "../Models/CategoryModel.js";
import asyncHandler from "express-async-handler";

// ******** Public CONTROLLERS******************
// @decs get all categories
// @router GET /api/categories
// @access Public
const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Categories.find({});
    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// *********ADMIN CONTROLLERS***********
// @decs create new category
// @router GET /api/categories
// @access Private Admin

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { title } = req.body;
    // create new category
    const category = new Categories({
      title,
    });
    const createCategory = await category.save();
    res.status(201).json(createCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @decs update category
// @router PUT /api/categories/:id
// @access Private Admin
const updateCategory = asyncHandler(async (req, res) => {
  try {
    // get category id from request
    const category = await Categories.findById(req.params.id);
    if (category) {
      //update category title
      category.title = req.body.title || category.title;
      //save the catogory title
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @decs delete category
// @router DELETE /api/categories/:id
// @access Private Admin
// const deleteCategory = asyncHandler(async (req, res) => {
//   try {
//     const category = await Categories.findById(req.params.id);
//     if (category) {
//       await category.remove();
//       res.json({ message: "Categories removed" });
//     } else {
//       res.status(404).json({ message: "Categories not found" });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    // Find the category by ID
    const category = await Categories.findById(req.params.id);

    if (category) {
      // Remove the category
      // await category.remove();
      await Categories.deleteOne({ _id: req.params.id });

      // Send a success response
      res.json({ message: "Category removed" });
    } else {
      // Send a 404 error if the category was not found
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    // Send a 400 error for other errors and log the error message
    res.status(400).json({ message: error.message });
  }
});
export { getCategories, createCategory, updateCategory, deleteCategory };
