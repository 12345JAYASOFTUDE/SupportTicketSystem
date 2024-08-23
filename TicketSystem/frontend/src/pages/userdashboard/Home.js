import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../utils';
import { ToastContainer } from 'react-toastify';
import './home.css';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [tickets, setTickets] = useState([]);
    const [editTicket, setEditTicket] = useState(null); // For editing tickets
    const [showCreateForm, setShowCreateForm] = useState(false); // State to show/hide create form
    const [newTicket, setNewTicket] = useState({
        title: '',
        description: '',
        priority: '',
        userId:''
    });
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(sessionStorage.getItem('loggedInUser'));
        // fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const url = "http://localhost:8000/tickets";
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
            });
            const result = await response.json();
            setTickets(result.tickets || []);
        } catch (err) {
            handleError(err);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login'); // Redirect to login page instead of home page after logout
        }, 1000);
    };

    const handleDeleteTicket = async (ticketId) => {
        try {
            const url = `http://localhost:8000/tickets/${ticketId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            const result = await response.json();
            if (result.success) {
                handleSuccess('Ticket deleted successfully');
                fetchTickets(); // Refresh ticket list
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err);
        }
    };

    // const handleUpdateTicket = async () => {
    //     if (!editTicket) return;
    //     try {
    //         const url = `http://localhost:8000/tickets/${editTicket.id}`;
    //         const response = await fetch(url, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    //             },
    //             body: JSON.stringify(editTicket)
    //         });
    //         const result = await response.json();
    //         if (result.success) {
    //             handleSuccess('Ticket updated successfully');
    //             setEditTicket(null);
    //             fetchTickets(); // Refresh ticket list
    //         } else {
    //             handleError(result.message);
    //         }
    //     } catch (err) {
    //         handleError(err);
    //     }
    // };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setEditTicket({ ...editTicket, [name]: value });
    // };

    const handleNewTicketChange = (e) => {
        const { name, value } = e.target;
        setNewTicket({ ...newTicket, [name]: value });
    };

    useEffect(() => {
        // Fetch the user from session storage
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            // Set only the userId into the state
            setNewTicket(prevState => ({
                ...prevState,
                userId: parsedUser._id
            }));
        }
    }, []);
    const handleCreateTicket = async () => {
      
        try {
            const url = "http://localhost:8000/tickets/create";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify(newTicket)
            });
            const result = await response.json();
            if (result.success) {
                handleSuccess('Ticket created successfully');
                setNewTicket({ title: '', description: '', priority: 'Low' }); // Reset form
                setShowCreateForm(false); // Hide form
                fetchTickets(); // Refresh ticket list
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <div className="usercontainer">
            <nav className="navbar">
                <div className="welcome-message">Welcome {loggedInUser}</div>
                <button className="Button" onClick={handleLogout}>Logout</button>
            </nav>

            <button className="create-button" onClick={() => setShowCreateForm(true)}>Create Ticket</button>

            <div className="container">
                {tickets.map(ticket => (
                    <div key={ticket.id} className="ticket-item">
                        <h3>{ticket.title}</h3>
                        <p>{ticket.description}</p>
                        <p>Priority: {ticket.priority}</p>
                        <button className="Button" onClick={() => setEditTicket(ticket)}>Edit</button>
                        <button className="Button" onClick={() => handleDeleteTicket(ticket.id)}>Delete</button>
                    </div>
                ))}

                {/* Create Ticket Form */}
                <div className={`create-ticket-form ${showCreateForm ? 'show' : ''}`}>
                    <button className="close-button" onClick={() => setShowCreateForm(false)}>&times;</button>
                    <h2>Create Ticket</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateTicket(); }}>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={newTicket.title}
                                onChange={handleNewTicketChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={newTicket.description}
                                onChange={handleNewTicketChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={newTicket.priority}
                                onChange={handleNewTicketChange}
                                required
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <button type="submit" className="Button">Submit</button>
                    </form>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}

export default Home;
