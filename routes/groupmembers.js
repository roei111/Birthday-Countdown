const express = require("express");
const router = express.Router();
const GroupMember = require("../models/groupMember");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const { protectRoute } = require("../middleware");
const { storage, cloudinary } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });

const findAllGroupMembers = async (groupId) => {
  const user = await User.find({ "groups._id": groupId }).populate(
    "groups.groupMembers"
  );
  const group = user[0].groups.find(
    (group) => group._id.toString() === groupId
  );
  return group.groupMembers;
};

router.get(
  "/:groupId",
  protectRoute,
  catchAsync(async (req, res) => {
    const groupmembers = await findAllGroupMembers(req.params.groupId);
    res.send({ groupmembers });
  })
);

router.post(
  "/:groupId",
  protectRoute,
  upload.single("image"),
  catchAsync(async (req, res) => {
    const { groupId } = req.params;
    const { firstName, lastName, birthday, gender } = req.body;
    const age = new Date().getFullYear() - new Date(birthday).getFullYear();
    let image;
    if (req.file) {
      image = { url: req.file.path, fileName: req.file.filename };
    } else {
      image = null;
    }
    const groupmember = new GroupMember({
      firstName,
      lastName,
      birthday,
      gender,
      age,
      image: image,
    });
    await groupmember.save();
    await User.findOneAndUpdate(
      { "groups._id": groupId },
      { $push: { "groups.$.groupMembers": groupmember } }
    );
    const groupmembers = await findAllGroupMembers(groupId);
    res.send({ groupmembers });
  })
);

router.delete(
  "/:groupId/:groupMemberId",
  protectRoute,
  catchAsync(async (req, res) => {
    const { groupId, groupMemberId } = req.params;
    await GroupMember.findByIdAndDelete(groupMemberId);
    await User.findOneAndUpdate(
      { "groups._id": groupId },
      { $pull: { "groups.$[].groupMembers": groupMemberId } }
    ).populate("groups.groupMembers");
    const groupmembers = await findAllGroupMembers(groupId);
    res.send({ groupmembers });
  })
);

router.put(
  "/:groupId/:groupMemberId",
  protectRoute,
  upload.single("image"),
  catchAsync(async (req, res) => {
    const { groupId, groupMemberId } = req.params;
    const { firstName, lastName, birthday, gender, editImage, removeOldImage } =
      req.body;
    const age = new Date().getFullYear() - new Date(birthday).getFullYear();
    const image = JSON.parse(editImage[0]); //old image
    let imageData;
    if (req.file) {
      if (image) {
        await cloudinary.uploader.destroy(image.fileName);
      }
      imageData = { url: req.file.path, fileName: req.file.filename };
    } else {
      if (!image) {
        imageData = null;
      } else {
        if (removeOldImage === "true") {
          await cloudinary.uploader.destroy(image.fileName);
          imageData = null;
        } else {
          imageData = { url: image.url, fileName: image.fileName };
        }
      }
    }
    await GroupMember.findByIdAndUpdate(groupMemberId, {
      firstName: firstName,
      lastName: lastName,
      birthday: birthday,
      gender: gender,
      age: age,
      _id: groupMemberId,
      image: imageData,
    });
    const groupmembers = await findAllGroupMembers(groupId);
    res.send({ groupmembers });
  })
);

module.exports = router;
