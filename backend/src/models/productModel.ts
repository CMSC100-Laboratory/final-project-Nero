import { Document, Schema, model, Types } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  productName: string;
  description: string;
  productType: 1 | 2;
  quantity: number;
  price: number;
  imageUrl?: string;
}

const productSchema = new Schema<IProduct>(
  {
    productName: { type: String, required: true },
    description: { type: String, required: true },
    productType: { type: Number, required: true, enum: [1, 2] },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const Product = model<IProduct>("Product", productSchema);

export default Product;
