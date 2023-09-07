import express from "express";
import { 
    getCollectionsBySearch, 
    getAllCollections,
    getCollection,
    toggleCollectionEngagement
} from "./main.controller.js";

const mainRouter = express.Router()


mainRouter.get("/search", getCollectionsBySearch)
mainRouter.get("/", getAllCollections)
mainRouter.get("/:id", getCollection)
mainRouter.post("/togglecollectionengagement", toggleCollectionEngagement)

export default mainRouter