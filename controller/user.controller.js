const User = require("../model/User.model");

const getAllUser = async (req, res, next) => {
  console.log(req.user);
  const { search } = req.query;
  const keyword = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  try {
    const users = await User.find(keyword).find({
      _id: { $ne: req?.user._id },
    });
    if (users.length > 0)
      res.json({
        success: true,
        data: users,
      });
    else {
      res.json({
        success: false,
        message: "no user exists",
      });
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { getAllUser };
