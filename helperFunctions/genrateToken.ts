const jwt = require("jsonwebtoken");

const generateAuthToken = async function (
  id: String,
  user: { tokens: { token: string }[] }
) {
  const token: string = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1000days",
  });
  user.tokens = user.tokens.concat({
    token,
  });

  return token;
};

module.exports = generateAuthToken;
