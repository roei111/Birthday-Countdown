const jwt = require("jsonwebtoken");
const catchAsync = require("./utils/catchAsync");
const User = require("./models/user");

module.exports.protectRoute = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401);
      throw new Error("אין לך הרשאה לבצע את הפעולה");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("אין לך הרשאה לבצע את הפעולה");
  }

});
