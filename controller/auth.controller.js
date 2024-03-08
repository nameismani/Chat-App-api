const User = require("../model/User.model");

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = async (req, res, next) => {
  let { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return next("Please Enter all the Feilds");
  }
  if (typeof password !== "string") {
    return next("Password need to be string");
  }
  if (!pic) {
    pic =
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  }
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return next("User already exists");
    }
    console.log(pic);
    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      let token = user.createJWT();
      res
        .status(201)
        .cookie("access_token", token, {
          httpOnly: true,
          //   sameSite: "strict",
          maxAge: 10 * 24 * 60 * 60 * 1000,
        })
        .json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
          },
        });
    } else {
      return next("User not found");
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      let token = user.createJWT();
      res
        .status(201)
        .cookie("access_token", token, {
          httpOnly: true,
          //   sameSite: "strict",
          maxAge: 10 * 24 * 60 * 60 * 1000,
        })
        .json({
          success: true,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
          },
        });
    } else {
      return next("Invalid Email or Password");
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const signout = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json({
      success: true,
      message: "User has been signed out",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  registerUser,
  signIn,
  signout,
};
