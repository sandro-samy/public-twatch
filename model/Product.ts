import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "name is required!"],
      unique: [true, "product name already exist"],
    },
    slug: {
      type: String,
      require: [true, "slug is required!"],
      unique: [true, "product slug already exist"],
    },
    price: { type: Number, require: [true, "price is required!"] },
    description: { type: String, require: [true, "description is required!"] },
    image: { type: String, require: [true, "image is required!"] },
    brand: { type: String, require: [true, "brand is required!"] },
    rating: {
      type: Number,
      require: [true, "rating is required!"],
      default: 4,
    },
    numOfReviews: {
      type: Number,
      require: [true, "num of reviews is required!"],
      default: 0,
    },
    countInStock: {
      type: Number,
      require: [true, "count in stock is required!"],
      default: 0,
    },
    gender: {
      type: String,
      require: [true, "gender is required!"],
      enum: ["men", "women", "kids"],
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
