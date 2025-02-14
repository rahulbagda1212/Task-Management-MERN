const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  learning: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  // Reference to the User model
    required: true 
  },
  // Reference to the Description model
  // descriptionId: { 
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: 'Description' ,
  //   required: true
  // },
  timeSlots: [
    {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      notes: { type: String }
    }
  ],
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }, // Add status field  
},{
    timestamps : true
  }
);


module.exports = mongoose.model('Task', taskSchema);