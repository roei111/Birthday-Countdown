var express = require("express");
var router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const GroupMember = require("../models/groupMember");
const { protectRoute } = require("../middleware");

router.get(
  "/",
  protectRoute,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error("המשתמש לא נמצא");
    }
    res.send(user.groups);
  })
);

router.post(
  "/",
  protectRoute,
  catchAsync(async (req, res) => {
    const { groupName } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id,
      { $push: { "groups": {groupName: groupName } } },
      { new: true });
    res.send(user.groups);
  })
);

router.delete(
  "/:groupId",
  protectRoute,
  catchAsync(async (req, res) => {
    const { groupId } = req.params;
    const user = await User.findById(req.user._id);
    const group = user.groups.find((group) => group._id.toString() === groupId);
    const groupIndex = user.groups.indexOf(group);
    user.groups[groupIndex].groupMembers.map(
      async (groupMember) => await GroupMember.findByIdAndDelete(groupMember)
    );
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { groups: { _id: groupId } } },
      { new: true }
    );
    res.send(updatedUser.groups);
  })
);

router.put(
  "/:groupId",
  protectRoute,
  catchAsync(async (req, res) => {
    const { groupId } = req.params;
    const { groupName } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { "groups._id": groupId },
      { $set: { "groups.$.groupName": groupName } },
      { new: true }
    );
    res.send(updatedUser.groups);
  })
);

module.exports = router;
