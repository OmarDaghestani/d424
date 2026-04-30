import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  stripePaymentIntentId: String,
  amount: Number,
  status: {
    type: String,
    enum: ["pending", "succeeded", "failed"],
    default: "pending",
  },
  paymentMethod: String,
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
