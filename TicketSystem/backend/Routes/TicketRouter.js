import express from 'express';
import ensureAuthenticated from '../middlewares/Auth.js';
import { createTicket } from '../Controllers/TicketController.js';
import { getTickets } from '../Controllers/TicketController.js';
import { deleteticket } from '../Controllers/TicketController.js';
import { updateTicket } from '../Controllers/TicketController.js';

const router = express.Router();

// Create a new ticket
router.post('/create', ensureAuthenticated, createTicket);
router.get('/getticket', getTickets);
router.delete('/delete',deleteticket);
router.update('/update',updateTicket);

// // Get all tickets for the logged-in user
// router.get('/all', ensureAuthenticated, getAllTickets);

// // Update a ticket
// router.put('/update/:id', ensureAuthenticated, updateTicket);

// // Delete a ticket
// router.delete('/delete/:id', ensureAuthenticated, deleteTicket);

export default router;
