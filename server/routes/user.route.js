import express from "express";
import { 
    createNewUser,
    getAllUsers, 
    getUser,
    toggleToWatchList,
} from "./user.controller.js";

const usersRouter = express.Router()


usersRouter.get("/", getAllUsers)
usersRouter.get("/:id", getUser)
usersRouter.post("/signup", createNewUser)
usersRouter.post("/toggletowatchlist", toggleToWatchList)




export default usersRouter