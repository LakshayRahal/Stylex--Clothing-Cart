// const express = require("express");

// const {
//   createOrder,
//   getAllOrdersByUser,
//   getOrderDetails,
//   capturePayment,
// } = require("../../controllers/shop/order-controller");

// const router = express.Router();

// router.post("/create", createOrder);
// router.post("/capture", capturePayment);
// router.get("/list/:userId", getAllOrdersByUser);
// router.get("/details/:id", getOrderDetails);

// module.exports = router;


const express = require("express");
const firebaseAuth  = require("../../middleware/firebaseAuth"); 
const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
} = require("../../controllers/shop/order-controller");


const router = express.Router();

router.post("/create", firebaseAuth, createOrder);     
router.post("/capture", firebaseAuth, capturePayment); 
router.get("/get", firebaseAuth, getAllOrdersByUser);  
router.get("/details/:id", firebaseAuth, getOrderDetails); 

module.exports = router;