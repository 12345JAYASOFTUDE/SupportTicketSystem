import { ticketModel } from "../models/ticketModels.js";


export const create = async (req, res) => {
  try {
    const ticketData = new ticketModel(req.body);
    const { title} = userData;

    const ticketExist = await ticketModel.findOne({ title });
    if (ticketExist) {
      return res
        .status(400)
        .json({ message: "user already exists ,you can direct log in." });
    }

    const savedUser = await ticketData.save();

    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error. " });
  }
};
export const fetch = async (req, res) => {
  try {
    const {title } = req.body;
    const tickets= await ticketModel.findOne({ email });

    if (tickets === 0) {
      return res.status(404).json({ message: "ticket not Found." });
    }

    if (ticketModel.checktitel(password, tickets.password)) {
      return res.status(200).json(users);
    } else {
      return res.status(401).json({ message: "Invalid ticket." });
    }
  } catch (error) {
    res.status(500).json({ error: " Internal Server Error. " });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;

    const ticketExist = await ticketModel.findOne({ _id: id });
    if (!ticketExist) {
      return res.status(404).json({ message: "user not found." });
    }

    const updateticket = await ticketModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json(updateticket);
  } catch (error) {
    res.status(500).json({ error: " Internal Server Error. " });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const ticketExist = await ticketModel.findOne({ _id: id });
    if (!ticketExist) {
      return res.status(404).json({ message: " ticket Not Found. " });
    }

    await ticketModel.findByIdAndDelete(id);
    nse;
    res.status(201).json({ message: " user deleted Successfully." });
  } catch (error) {
    res.status(500).json({ error: " Internal Server Error. " });
  }
};
