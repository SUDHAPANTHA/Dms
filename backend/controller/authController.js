const BlacklistedToken = require("../models/logout");

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(400).json({ message: "No token provided." });
    }

    // Add the token to the blacklist
    const blacklistedToken = new BlacklistedToken({ token });
    await blacklistedToken.save();

    res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Something went wrong during logout." });
  }
};
