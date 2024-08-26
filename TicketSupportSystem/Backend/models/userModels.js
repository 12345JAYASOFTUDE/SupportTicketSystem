import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
    set: (password) => {
      const saltKey = bcryptjs.genSaltSync(10);
      return bcryptjs.hashSync(password, saltKey);
    },
  },
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }]
});
export const userModel = mongoose.model("users", userSchema);

userModel.checkPassword = (password, encryptpassword) => {
  return bcryptjs.compareSync(password, encryptpassword);
};
