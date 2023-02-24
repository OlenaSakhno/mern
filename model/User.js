const mongoose = require("mongoose");
const { modelName } = require("./Employee");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2015,
    },
    Editor: Number,

    Admin: Number,
    refreshToken: String,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
