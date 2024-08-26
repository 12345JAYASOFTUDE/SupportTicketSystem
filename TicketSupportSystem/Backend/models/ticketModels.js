import mongoose from "mongoose";


const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  Description: {
    type: String,
    required: true,
  },

  Priority: {
    type: String,
    required: true,
 
  },
  createdBy:
   { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'users',
     required: true },
});
export const ticketModel = mongoose.model("tickets", ticketSchema);


