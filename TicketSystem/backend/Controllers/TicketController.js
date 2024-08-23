import Ticket from "../Models/Ticket.js";

export const createTicket = async (req, res) => {
    console.log(req.body)
    const { title, description, priority,userId } = req.body;
    console.log(userId)
    if (!title || !description || !priority) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    try {
        const newTicket = new Ticket({
            title,
            description,
            priority,
            user: userId
        });
        await newTicket.save();
        res.status(201).json({ success: true, message: 'Ticket created', ticket: newTicket });
    } catch (err) {
        console.error('Error creating ticket:', err); // Log the error details
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};
