import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "name required"] },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: [true, "password required"] },
    isAdmin: { type: Boolean, required: true, default: false },
    isSuperAdmin: { type: Boolean, required: true, default: false },
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const User =  mongoose.models.User ||  mongoose.model("User", userSchema);
export default User;
