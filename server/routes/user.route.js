import express from "express";
import { 
    addToList,
    createNewUser,
    getAllUsers, 
    getUser,
    removeFromList,
} from "./user.controller.js";

const usersRouter = express.Router()


usersRouter.get("/", getAllUsers)
usersRouter.get("/:id", getUser)
usersRouter.post("/signup", createNewUser)
usersRouter.post("/:id/addtolist", addToList)
usersRouter.post("/:id/removefromlist", removeFromList)




export default usersRouter