const express = require("express");
const firebaseAuth = require("../../middleware/firebaseAuth");

const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
} = require("../../controllers/shop/cart-controller");

const router = express.Router();

//   All cart routes are protected
//   userId is derived from Firebase token → MongoDB

router.post("/add", firebaseAuth, addToCart);

router.get("/get", firebaseAuth, fetchCartItems);

router.put("/update", firebaseAuth, updateCartItemQty);

router.delete("/:productId", firebaseAuth, deleteCartItem);

module.exports = router;
