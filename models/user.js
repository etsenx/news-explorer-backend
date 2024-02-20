const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Incorrect Email Format",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return (
    this.findOne({ email })
      // Select password specifically because default doesnt return password
      .select("+password")
      .then((user) => {
        if (!user) {
          return Promise.reject(
            Object.assign(new Error("Email atau password salah"), {
              statusCode: 401,
            })
          );
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            return Promise.reject(
              Object.assign(new Error("Email atau password salah"), {
                statusCode: 401,
              })
            );
          }

          return user;
        });
      })
  );
};

userSchema.statics.createUser = function createUser(email, password, name) {
  return bcrypt
    .hash(password, 10)
    .then((hashedPass) => this.create({ email, password: hashedPass, name }))
    .then((user) => user);
};

module.exports = mongoose.model("user", userSchema);
