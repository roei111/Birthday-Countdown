const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupMemberSchema = new Schema({
  firstName: String,
  lastName: String,
  birthday: Date,
  gender: String,
  age: Number,
  image: {
    url: String,
    fileName: String,
  },
});

module.exports = mongoose.model("GroupMember", GroupMemberSchema);
