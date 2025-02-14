const Task = require('../models/TaskModel');

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    //const tasks = await Task.find();
  const tasks = await Task.aggregate([
  {
    $lookup: {
      from: "descriptions", // Collection name in MongoDB (should match DB collection name)
      localField: "user", // Field from `Task`
      foreignField: "user", // Field from `Description`
      as: "descriptions", // Output array field
    },
  },
  {
    $unwind: {
      path: "$descriptions",
      preserveNullAndEmptyArrays: true, // Keeps tasks even if no description exists
    },
  },
  {
    $project: {
      _id: 1,
      learning: 1,
      startTime: 1,
      endTime: 1,
      status: 1,
      timeSlots: 1,
      createdAt: 1,
      updatedAt: 1,
      user: 1,
      "descriptions.title": 1,
      "descriptions.description": 1,
    },
  },
]);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new task
exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single task
exports.getTasks = async (req, res) => {
  try {
    const task = await Task.findById(req.params._id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};