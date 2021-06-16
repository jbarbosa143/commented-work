const bcrypt = require("bcryptjs");
const User = require("../model/User");

const jwt = require("jsonwebtoken");

// this is creating a function that allows a user to sign up with required input fields a userid,a email,password, first name and a lastname
async function signup(req, res) {
  const { username, email, password, firstName, lastName } = req.body;

  const { errorObj } = res.locals;
// if a obj in the field is incomplete return a error
  if (Object.keys(errorObj).length > 0) {
    return res.status(500).json({ message: "failure", payload: errorObj });
  }
  // this is encrypting the password so other coders cant get your password as easily
  try {
    let salt = await bcrypt.genSalt(12);
    let hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });
// saves/store users info
    let savedUser = await createdUser.save();
    // if sucsessful return a success message in terminal/ if not return Error message
    res.json({ message: "success", data: savedUser });
  } catch (e) {
    console.log(e);
    console.log(e.message);
    res.json({ message: "error", error: e });
  }
}
// this is the login function with email and password required for login
async function login(req, res) {
  const { email, password } = req.body;

  const { errorObj } = res.locals;
// if any of the previous requirement are not met throw a error message and do not log in 
  if (Object.keys(errorObj).length > 0) {
    return res.status(500).json({ message: "failure", payload: errorObj });
  }
// for loop through all created users and and see if log in info matched any stored user info
  try {
    let foundUser = await User.findOne({ email: email });
// if any info thats required for login is incorrect throw a error message
    if (!foundUser) {
      res.status(400).json({
        message: "failure",
        payload: "Please check your email and password",
      });
    } else {
      //password = 1, foundUser.password = $2a$12$tauL3AEb5gvKdcQdDKNWLeIYv422jNq2aRsaNWF5J4TdcWEdhq4CO
      let comparedPassword = await bcrypt.compare(password, foundUser.password);
// if any info thats required for login is incorrect throw a error message
      if (!comparedPassword) {
        res.status(400).json({
          message: "failure",
          payload: "Please check your email and password",
        });
      } else {
        let jwtToken = jwt.sign(
          {
            email: foundUser.email,
            username: foundUser.username,
          },
          process.env.PRIVATE_JWT_KEY,
          {
            expiresIn: "1d",
          }
        );
// if everything matches requirement log-in
        res.json({ message: "success", payload: jwtToken });
      }
    }
  } catch (e) {
    res.json({ message: "error", error: e });
  }
}

module.exports = { signup, login };
