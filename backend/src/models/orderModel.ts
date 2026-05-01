import { Document, Schema, model, Types } from "mongoose";

export interface IOrder extends Document {
  _id: Types.ObjectId;
  transactionId: string;
  productId: Types.ObjectId;
  orderQuantity: number;
  orderStatus: 0 | 1 | 2 | 3;
  email: string;
  dateOrdered: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    transactionId: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    orderQuantity: { type: Number, required: true },
    orderStatus: { type: Number, required: true, enum: [0, 1, 2, 3] },
    email: { type: String, required: true },
    dateOrdered: { type: Date, required: true },
  },
  { timestamps: true }
);

const Order = model<IOrder>("Order", orderSchema);

export default Order;
