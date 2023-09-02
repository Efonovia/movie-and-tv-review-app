import express from "express";
import { 
    addReply,
    addReviewComment,
    changeRating,
    createNewReview,
    deleteReply,
    deleteReviewComment,
    getAllReviews, 
    getReview,
    likeReviewComment,
} from "./review.controller.js";

const ReviewsRouter = express.Router()


ReviewsRouter.get("/", getAllReviews)
ReviewsRouter.get("/:id", getReview)
ReviewsRouter.post("/create", createNewReview)
ReviewsRouter.post("/comment", addReviewComment)
ReviewsRouter.post("/deletecomment", deleteReviewComment)
ReviewsRouter.post("/changerating", changeRating)
ReviewsRouter.post("/likecomment", likeReviewComment)
ReviewsRouter.post("/reply", addReply)
ReviewsRouter.post("/deletereply", deleteReply)




export default ReviewsRouter