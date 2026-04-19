import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  productType: {
    type: Number,
    required: true,
    enum: [1, 2],
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
