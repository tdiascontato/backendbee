const User = require("../models/User");
const bcrypt = require("bcrypt");
const cookie = require("cookie");

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, error: "Incorrect password" });
    }
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("loggedIn", "true", {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 dia
      })
    );
    // Retorne os dados do usuário
    res.json({
      success: true,
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        celular: user.celular,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ success: false, error: "Error during login", detailedError: error.message });
  }
};
