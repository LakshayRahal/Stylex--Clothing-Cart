const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");


  // Helper: get MongoDB user from Firebase token

const getDbUser = async (req) => {
  if (!req.user?.email) {
    throw new Error("Unauthenticated");
  }

  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    throw new Error("User not found in database");
  }

  return user;
};

// add
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
   
    if (!productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product or quantity",
      });
    }

    const dbUser = await getDbUser(req);
    const userId = dbUser._id;
   

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[index].quantity += quantity;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  fetch
const fetchCartItems = async (req, res) => {
  try {
    const dbUser = await getDbUser(req);
    const userId = dbUser._id;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [] },
      });
    }

    const items = cart.items
      .filter((item) => item.productId)
      .map((item) => ({
        productId: item.productId._id,
        image: item.productId.image,
        title: item.productId.title,
        price: item.productId.price,
        salePrice: item.productId.salePrice,
        quantity: item.quantity,
      }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items,
      },
    });
  } catch (error) {
    console.error("FETCH CART ERROR:", error.message);
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// update 
const updateCartItemQty = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }

    const dbUser = await getDbUser(req);
    const userId = dbUser._id;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const index = cart.items.findIndex(
      (item) => item.productId._id.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not in cart",
      });
    }

    cart.items[index].quantity = quantity;
    await cart.save();

    const items = cart.items.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items,
      },
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete
const deleteCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const dbUser = await getDbUser(req);
    const userId = dbUser._id;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    const items = cart.items.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items,
      },
    });
  } catch (error) {
    console.error("DELETE CART ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
};
