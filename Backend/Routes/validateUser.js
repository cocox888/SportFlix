const jwt_decode = require("jwt-decode");

const validateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    const userDetails = jwt_decode(token);
    const userId = userDetails.data._id;
    req.body.userId = userId;
    req.query.userId = userId;
    next();
  } catch (err) {
    res.status(400).send({ message: "User not signedin" });
  }
};
module.exports = validateUser;
