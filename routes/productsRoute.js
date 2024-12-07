const express = require("express");
const {
  createProduct,
  showProducts,
  editProduct,
  deleteProduct,
} = require("../controllers/productController.js");
const authenticateUser = require("../middlewares/authenticateUser.js");

const router = express.Router();

router.post("/product", authenticateUser, createProduct);
router.get("/product", authenticateUser, showProducts);
router.put("/product/:id", authenticateUser, editProduct);
router.patch("/product/:id", authenticateUser, deleteProduct);

module.exports = router;
