import express from "express";
import {
  createProduct,
  showProducts,
  editProduct,
  deleteProduct,
} from "../controllers/productController.js";
import authenticateUser from "../middlewares/authenticateUser.js";

const router = express.Router();

router.post("/product", authenticateUser, createProduct);
router.get("/product", authenticateUser, showProducts);
router.put("/product/:id", authenticateUser, editProduct);
router.patch("/product/:id", authenticateUser, deleteProduct);

export default router;
