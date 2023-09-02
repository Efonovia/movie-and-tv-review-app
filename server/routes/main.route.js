import express from "express";
import { 
    getCollectionsBySearch, 
} from "./main.controller.js";

const mainRouter = express.Router()


mainRouter.get("/search", getCollectionsBySearch)

export default mainRouter