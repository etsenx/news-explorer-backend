const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Create User
module.exports.register = (req, res, next) => {
  const { email, password, name } = req.body;
  return User.createUser(email, password, name)
    .then((user) => {
      res.status(201).send({
        email: user.email,
        name: user.name,
        __id: user.id,
      });
    })
    .catch((err) => {
      if (err) {
        if (err.code === 11000) {
          next({
            statusCode: 409,
            message: "User already exists",
          });
        } else if (err.name == "ValidationError") {
          next({
            statusCode: 400,
            message: "User validation failed",
          });
        }
      }
      next(err);
    });
};

// Login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          process.env.NODE_ENV === "production"
            ? process.env.JWT_SECRET
            : "devsecret",
          { expiresIn: "3d" }
        ),
      });
    })
    .catch(next);
};

// Get current logged in user
module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
};
