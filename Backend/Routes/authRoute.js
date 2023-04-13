const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../Model/UserModel");
const {
  registerValidation,
  loginValidation,
} = require("../Validation/SchemaValidation");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

// Funtion to calculate age

const calculateAge = (birthday) => {
  // birthday is a date
  var ageDifMs = Date.now() - birthday;
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

async function generateToken(data) {
  const token = await jwt.sign(
    {
      data,
    },
    process.env.JWT_SECRET
  );
  return token;
}

// Register

router.post("/signup", async (req, res) => {
  // Checking for validation wrt the schema defined
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  // check if the user already exists in the db
  const userFound = await UserModel.findOne({
    email: req.body.email,
  });
  if (userFound) {
    return res.status(400).send({ message: "User already exists" });
  }

  // Hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  //   Creating a new user
  const age = calculateAge(new Date(req.body.dob));
  const user = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
    dob: req.body.dob,
    age: age,
  });

  try {
    const newUser = await user.save();
    // Generate the jwt Token
    const _token = await generateToken(newUser);
    res.send({ user: newUser, message: "Signup success!", token: _token });
  } catch (err) {
    res.send(err);
  }
});

// Get user details using jwt token

router.get("/getUser", async (req, res) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded = jwt_decode(token);
    const userDetails = await UserModel.findOne({ _id: decoded.data._id });
    if (userDetails) {
      res.send(userDetails);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(404).send({ message: "User not found" });
  }
});

// Login
router.post("/login", async (req, res) => {
  // Checking for validation wrt the schema defined
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    // finding the user from the db
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(400).send({ message: "Invalid Login Credentials" });
    }

    // compare passwords
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(400).send({ message: "Invalid Login Credentials" });
    }

    // update age on each login
    const currentAge = calculateAge(new Date(user.dob));
    await UserModel.updateOne({ _id: user._id }, { $set: { age: currentAge } });

    // Generate the jwt Token
    const _token = await generateToken(user);
    res.send({ user: user, message: "Login success!", token: _token });
  } catch (err) {
    res
      .status(400)
      .send({ message: "Something went wrong ... please try again" });
  }
});

module.exports = router;
