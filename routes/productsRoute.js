import express from "express";
import {
  createProduct,
  showProducts,
  editProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/product", createProduct);
router.get("/product", showProducts);
router.put("/product/:id", editProduct);
router.patch("/product/:id", deleteProduct);

export default router;
