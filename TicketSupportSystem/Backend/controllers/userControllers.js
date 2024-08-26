import { userModel } from "../models/userModels.js";

export const create = async (req, res) => {
  try {
    const userData = new userModel(req.body);
    const { email } = userData;

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "user already exists ,you can direct log in." });
    }

    const savedUser = await userData.save();

    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error. " });
  }
};

export const fetch = async (req, res) => {
  try {
    const { password, email } = req.body;
    const users = await userModel.findOne({ email });

    if (users === 0) {
      return res.status(404).json({ message: "Users not Found." });
    }

    if (userModel.checkPassword(password, users.password)) {
      return res.status(200).json(users);
    } else {
      return res.status(401).json({ message: "Invalid Password." });
    }
  } catch (error) {
    res.status(500).json({ error: " Internal Server Error. " });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;

    const userExist = await userModel.findOne({ _id: id });
    if (!userExist) {
      return res.status(404).json({ message: "user not found." });
    }

    const updateUser = await userModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json(updateUser);
  } catch (error) {
    res.status(500).json({ error: " Internal Server Error. " });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const userExist = await userModel.findOne({ _id: id });
    if (!userExist) {
      return res.status(404).json({ message: " user Not Found. " });
    }

    await userModel.findByIdAndDelete(id);
    nse;
    res.status(201).json({ message: " user deleted Successfully." });
  } catch (error) {
    res.status(500).json({ error: " Internal Server Error. " });
  }
};
