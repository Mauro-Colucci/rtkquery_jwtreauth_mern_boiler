import Note from "../models/Note.js";
import User from "../models/User.js";
import asynchHandler from "express-async-handler";

// @desc Get all notes
// @route GET /notes
// @access Private
export const getAllNotes = asynchHandler(async (req, res) => {
  const notes = await Note.find().lean();
  if (!notes?.length)
    return res.status(400).json({ message: "No notes found" });

  //await Note.find().populate('user').lean().exec() would fill the user field with the user document, not add username
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  res.json(notesWithUser);
});

// @desc Create new note
// @route POST /notes
// @access Private
export const createNewNote = asynchHandler(async (req, res) => {
  const { user, title, text } = req.body;
  if (!user || !title || !text)
    return res.status(400).json({ message: "all fields are required" });

  //check for dupe title

  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate)
    return res.status(409).json({ message: "duplicate note title" });

  const note = await Note.create({ user, title, text });

  if (note) {
    return res.status(201).json({ message: "new note created" });
  } else {
    return res.status(400).json({ message: "invalid note data received" });
  }
});

// @desc Update a note
// @route PATCH /notes
// @access Private
export const updateNote = asynchHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;
  if (!id || !user || !title || !text || typeof completed !== "boolean")
    return res.status(400).json({ message: "all fields required" });

  //all this can be done with findByIdAndUpdate, but we'll miss some validation here

  //if I use lean(), would lose the save() method
  const note = await Note.findById(id).exec();
  if (!note) return res.status(404).json({ message: "note not found" });

  const duplicate = await Note.findOne({ title }).lean().exec();
  //we can edit the title, but only if it's our own note
  if (duplicate && duplicate?._id.toString() !== id)
    return res.status(404).json({ message: "duplicate note title" });

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();

  res.json({ message: `${updatedNote.title} has been updated` });
});

// @desc Delete a note
// @route DELETE /notes
// @access Private
export const deleteNote = asynchHandler(async (req, res) => {
  const { id } = req.body;
  //again, we could replace all this with findByIdAndDelete method

  if (!id) return res.status(400).json({ message: "note id is required" });

  const note = await Note.findById(id).exec();
  if (!note) res.status(404).json({ message: "note not found" });

  const result = await note.deleteOne();

  res.json(`note ${result.title} with ID ${result._id} has been deleted`);
});
