import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      index: true,
      trim: true,
      // this for remove space
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      // object array
      {
        type: Schema.Types.ObjectId,
        ref: "videoo",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"],
    },
    RefreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
userSchema.pre("save", async function (next) {
  //there will multiple modification while change something in model , yo make remain same th e password we have to make logic and logic is

  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next(); // 10 represent the no of round hash function shoulod use
}); // we cannot use callback function in pre becuase call back function does not have fproperty of this keyword and does not support context

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.genrateAccessToken = function () {    // method of calling shoul same and check typo
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};
userSchema.methods.genrateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};
export const User = mongoose.model("Usser", userSchema);    //usser is model name in mongo db

// as we know next is middleware
