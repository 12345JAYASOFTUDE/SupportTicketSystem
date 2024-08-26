import express from "express";

import {create, deleteUser,fetch, update} from "../controllers/ticketControllers.js";

const route2 = express.Router();

route2.get("/fetch", fetch);
route2.post("/create", create);
route2.put("/update/:title", update);
route2.delete("/delete/:title", deleteUser);

export default route2;
