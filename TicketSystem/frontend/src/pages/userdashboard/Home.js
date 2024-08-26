import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleError, handleSuccess } from "../../utils";
import { ToastContainer } from "react-toastify";
import "./home.css";
import Table from "react-bootstrap/Table";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

function Home() {
  const userjsonObj = sessionStorage.getItem("user");
  const user = JSON.parse(userjsonObj);
  const userId = user._id;
  const [loggedInUser, setLoggedInUser] = useState("");
  const [tickets, setTickets] = useState([]);
  console.log(tickets);

  const [editTicket, setEditTicket] = useState(null); // For editing tickets
  const [showCreateForm, setShowCreateForm] = useState(false); // State to show/hide create form
  const [showEditForm, setShowEditForm] = useState(false); // State to show/hide edit form
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "",
    userId: userId,
  });
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(sessionStorage.getItem("loggedInUser"));
  }, []);

  useEffect(() => {
    // Fetch user from session storage
    const userjsonObj = sessionStorage.getItem("user");
    const user = JSON.parse(userjsonObj);
    const userId = user._id;

    const url = "http://localhost:8000/tickets/getticket";

    axios
      .get(url, {
        params: { user: userId }, // Send data as query parameters
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Response:", response.data.tickets);
        setTickets(response.data.tickets);
      })
      .catch((err) => {
        // Handle error
        console.error(err);
      });
  }, []); // Make sure to include dependencies as needed

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("loggedInUser");
    handleSuccess("User Logged out");
    setTimeout(() => {
      navigate("/login"); // Redirect to login page after logout
    }, 1000);
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      console.log(ticketId);
      const url = `http://localhost:8000/tickets/delete`;
      const response = await axios.delete(url, {
        params: { id : ticketId} ,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Adjust as necessary
        },
      });
      const result = response.data;
      if (result.success) {
        handleSuccess("Ticket deleted successfully");
        setTickets(tickets.filter((ticket) => ticket._id !== ticketId)); // Remove ticket from state
      } else {
        handleError(result.message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleNewTicketChange = (e) => {
    const { name, value } = e.target;
    setNewTicket({ ...newTicket, [name]: value });
  };

  const handleCreateTicket = async () => {
    try {
      const url = "http://localhost:8000/tickets/create";
      const response = await axios.post(url, newTicket, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      const result = response.data;

      if (result.success) {
        handleSuccess("Ticket created successfully");
        setNewTicket({ title: "", description: "", priority: "Low" }); // Reset form
        setShowCreateForm(false); // Hide form
        // Refresh tickets
        const userjsonObj = sessionStorage.getItem("user");
        const user = JSON.parse(userjsonObj)._id;
        const updatedResponse = await axios.post(
          "http://localhost:8000/tickets/getticket",
          { user },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTickets(updatedResponse.data.tickets || []);
      } else {
        handleError(result.message);
      }
    } catch (err) {
      handleError(err);
    }
  };


  const handleUpdateTicket = async () => {
    try {
      const url = `http://localhost:8000/tickets/update`; // The endpoint for updating tickets
  
      // Prepare the request parameters
      const params = new URLSearchParams({ id: editTicket._id }).toString();
  
      // Make the PUT request with query parameters and request body
      const response = await axios.put(`${url}?${params}`, editTicket, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
  
      const result = response.data;
  
      if (result.success) {
        handleSuccess("Ticket updated successfully");
        setEditTicket(null); // Clear edit state
        setShowEditForm(false);

        // Refresh tickets

        const userjsonObj = sessionStorage.getItem("user");
        const user = JSON.parse(userjsonObj)._id;

        const updatedResponse = await axios.post(
          "http://localhost:8000/tickets/getticket",
          { user },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTickets(updatedResponse.data.tickets || []);
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
        <button className="Button" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <button className="create-button" onClick={() => setShowCreateForm(true)}>
        Create Ticket
      </button>

      {/* Create Ticket Form */}
      {showCreateForm && (
        <div className="create-ticket-form show">
          <button
            className="close-button"
            onClick={() => setShowCreateForm(false)}
          >
            &times;
          </button>
          <h2>Create Ticket</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateTicket();
            }}
          >
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
            <button type="submit" className="Button">
              Submit
            </button>
          </form>
        </div>
      )}

      {/* Edit Ticket Form */}
      {showEditForm && editTicket && (
        <div className="create-ticket-form show">
          <button
            className="close-button"
            onClick={() => setShowEditForm(false)}
          >
            &times;
          </button>
          <h2>Edit Ticket</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateTicket();
            }}
          >
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editTicket.title}
                onChange={handleEditTicketChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={editTicket.description}
                onChange={handleEditTicketChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={editTicket.priority}
                onChange={handleEditTicketChange}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <button type="submit" className="Button">
              Update
            </button>
          </form>
        </div>
      )}

      <div className="my-5 mx-5">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Serial No</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket._id}>
                <td>{index + 1}</td>
                <td>{ticket.title}</td>
                <td>{ticket.priority}</td>
                <td>{ticket.status || "Pending"}</td>
                <td className="d-flex">
                  <div className="mx-3">
                    <FaEdit
                      onClick={() => {
                        setEditTicket(ticket);
                        setShowEditForm(true);
                      }}
                    />
                  </div>
                  <div className="mx-3">
                    <MdDeleteForever
                      onClick={() => handleDeleteTicket(ticket._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Home;
