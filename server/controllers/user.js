import User from "../models/User.js";
import Note from "../models/Note.js";
import asyncHandler from "express-async-handler";
//express-async-errors would be easier to implement than asyncHandler, we just need to import it in server.js and that's it
import bcrypt from "bcrypt";

// @desc Get all users
// @route GET /users
// @access Private
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length)
    return res.status(400).json({ message: "No users found" });
  res.json(users);
});

// @desc Create user
// @route POST /users
// @access Private
export const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "all fields are required" });

  const duplicate = await User.findOne({ username })
    //str 2 checks for case insensitive matching, among other things
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) return res.status(409).json({ message: "Duplicate user" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { username, password: hashedPassword }
      : { username, password: hashedPassword, roles };

  const user = await User.create(userObject);

  if (user) {
    return res
      .status(201)
      .json({ message: `User ${username} has been created` });
  } else {
    return res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc Update user
// @route Patch /users
// @access Private
export const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  )
    return res.status(400).json({ message: "all fields are required" });

  const user = await User.findById(id).exec();

  if (!user) return res.status(400).json({ message: "User not found" });

  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate && duplicate?._id.toString() !== id)
    return res.status(409).json({ message: "duplicate user" });

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) user.password = await bcrypt.hash(password, 10);

  const updatedUser = await user.save();

  res.json({ message: `user ${updatedUser.username} has been updated` });
});

// @desc Delete user
// @route delete /users
// @access Private
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "user id is required" });

  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) return res.status(400).json({ message: "user has notes assigned" });

  const user = await User.findById(id).exec();
  if (!user) return res.status(400).json({ message: "user not found" });

  const result = await user.deleteOne();

  const reply = `username ${result.username} with ID ${result._id} has been deleted`;

  res.json(reply);
});
