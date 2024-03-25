import express from "express"
import { createCategoryController, deleteCategoryCOntroller, getAllCategoryController, updateCategoryController } from "../controller/categoryController.js";

const router = express.Router()



// create category route
router.post("/create-category", createCategoryController);
// get all category
router.get("/get-category", getAllCategoryController)
// update category
router.put("/update-category/:id", updateCategoryController)
// delete category
router.delete("/delete-category/:id", deleteCategoryCOntroller)





export default router;