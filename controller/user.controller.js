const User = require("../model/User.model");

const getAllUser = async (req, res, next) => {
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
    if (users.length > 0) res.send(users);
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { getAllUser };
