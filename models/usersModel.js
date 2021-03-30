const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "please input current Email"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    inactiveTime: {
      type: Date,
    },
    inactive: Boolean,
    photo: { type: String, default: "default.jpg" },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user", "lead-guide", "guide"],
    },
    hash: String,
    hashCreateAt: Date,
    passwordChangeAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("find", async function () {
  await this.findOne({ inactive: { $ne: true } });
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.passwordConfirm = undefined;
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePass = async function (pass, hash) {
  return await bcrypt.compare(pass, hash);
};

userSchema.methods.inactiveAcc = function () {
  this.inactive = true;
  this.inactiveTime = Date.now() + 30 * 24 * 60 * 60 * 1000;
};

userSchema.methods.activeAcc = function () {
  this.inactiveTime = undefined;
  this.inactive = false;
};

userSchema.methods.createHash = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.hash = crypto.createHash("sha256").update(token).digest("hex");
  console.log(this.hash, token);
  this.hashCreateAt = Date.now() + 10 * 60 * 1000;
  return token;
};
userSchema.methods.changePassword = function (password, passwordConfirm) {
  this.password = password;
  this.passwordConfirm = passwordConfirm;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
