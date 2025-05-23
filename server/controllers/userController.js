const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");

const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    return res.send(user);
  } catch (error) {
    res.status(500).send("Unable to get user");
  }
};

const getallusers = async (req, res) => {
  try {
    console.log(req.locals, "req.locals");
    const users = await User.find()
      .find({ _id: { $ne: req.locals } })
      .select("-password");
    return res.send(users);
  } catch (error) {
    res.status(500).send("Unable to get all users");
  }
};

const login = async (req, res) => {
  try {
    const emailPresent = await User.findOne({ email: req.body.email });
    if (!emailPresent) {
      return res.status(400).send("Incorrect credentials");
    }
    const verifyPass = await bcrypt.compare(
      req.body.password,
      emailPresent.password
    );
    if (!verifyPass) {
      return res.status(400).send("Incorrect credentials");
    }
    const token = jwt.sign(
      { userId: emailPresent._id, isAdmin: emailPresent.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "2 days",
      }
    );
    return res.status(201).send({ msg: "User logged in successfully", token });
  } catch (error) {
    res.status(500).send("Unable to login user");
  }
};

const register = async (req, res) => {
  // debugger;   
  // res.send("hello"); 
  try {
    const emailPresent = await User.findOne({ email: req.body.email });
    if(!req.body.password){
      return res.status(400).send("Please enter password.");
    }
    if (emailPresent) {
      console.log(emailPresent);
      return res.status(400).send("Email already exists");
    }
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    console.log("DATA " + req.body);
    const user = await User({ ...req.body, password: hashedPass });
    const result = await user.save();
    if (!result) {
      return res.status(500).send("Unable to register user");
    }
    console.log(result);
    return res.status(201).send("User registered successfully");
  } catch (error) {
    console.log("Error while registering: ", error)
    res.status(500).send("Unable to register user");
  }
};

const updateprofile = async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const result = await User.findByIdAndUpdate(
      { _id: req.locals },
      { ...req.body, password: hashedPass }
    );
    if (!result) {
      return res.status(500).send("Unable to update user");
    }
    return res.status(201).send("User updated successfully");
  } catch (error) {
    res.status(500).send("Unable to update user");
  }
};

const deleteuser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.body.userId);
    const removeDoc = await Doctor.findOneAndDelete({
      userId: req.body.userId,
    });
    const removeAppoint = await Appointment.findOneAndDelete({
      userId: req.body.userId,
    });
    return res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Unable to delete user");
  }
};

const googleLogin=async (req, res) => {
  const { email, name, picture, googleId } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firstname: name.split(" ")[0],
        lastname: name.split(" ")[1] || "",
        email,
        pic: picture,
        password: googleId, // or hash something if needed
        googleId,
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Google login failed");
  }
}

module.exports = {
  getuser,
  getallusers,
  login,
  register,
  updateprofile,
  deleteuser,
  googleLogin
};
