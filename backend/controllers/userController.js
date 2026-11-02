import User from "../models/User.js";

const toPublicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(toPublicUser(user));
  } catch (error) {
    console.error("Get Profile Error:", error.message);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body;

  for (const value of [name, email, password]) {
    if (value !== undefined && typeof value !== "string") {
      return res.status(400).json({ message: "Invalid profile data" });
    }
  }
  if (password && password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    // Assign the plain password; the model's pre-save hook hashes it once
    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();
    res.status(200).json(toPublicUser(updatedUser));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email is already in use" });
    }
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Failed to update user profile" });
  }
};

// Delete the logged-in user's account
export const deleteUserProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    console.error("Delete Profile Error:", error.message);
    res.status(500).json({ message: "Failed to delete account" });
  }
};
