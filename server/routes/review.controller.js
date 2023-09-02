import ReviewDatabase from "../models/review.mongo.js"
import { nanoid } from "nanoid"

export const getAllReviews = async (req, res) => {
    try {
        return res.status(200).json(await ReviewDatabase.find({}, { '_id': 0, '__v': 0 }))
    } catch (error) {
        return res.staus(404).json({error: error.message})
    }
}

export const getReview = async (req, res) => {
    try {
        const { id } = req.params
        const review = await ReviewDatabase.findById(id)
        return res.status(200).json(review)
    } catch (error) {
        return res.status(404).json({error: error.message})
    }
}

export const createNewReview = async (req, res) => {
    console.log("creating review...")
    try {
      const {
        collectionId,
        reviewerId,
        rating,
        comment
      } = req.body
  
      console.log(req.body)
  
      const newReview = new ReviewDatabase({
        collectionId,
        reviewerId,
        rating,
        comments: [
            {
                commentId: nanoid(),
                commentText: comment,
                replies: [],
                likes: {},
                dateCreated: new Date()
            }
        ]
      })

      newReview.save().then(() => {
        console.log('New review created successfully');
      }).catch((error) => {
          console.log(error);
        });

    return res.status(201).json(newReview)
  
    } catch (error) {
      return res.status(500).json({error: error.message})
    }
}

export const addReviewComment = async (req, res) => {
    try {
        const { reviewId, comment } = req.body
  
        console.log(req.body)
        const review = await ReviewDatabase.findById(reviewId)
        const newComment = {
            "commentId": nanoid(),
            "commentText": comment,
            "replies": [],
            "likes": {},
            "dateCreated": new Date()
        }
        
        review.comments.push(newComment)
        await review.save()
  
        const formattedReview = await ReviewDatabase.findById(reviewId)
        return res.status(201).json(formattedReview)
    } catch (error) {
        console.log(error)
        return res.status(404).json({error: error.message})
    }
}

export const deleteReviewComment = async (req, res) => {
    try {
        const { reviewId, commentId } = req.body
        console.log(req.body)
        const review = await ReviewDatabase.findById(reviewId)
        review.comments = review.comments.filter(comment => comment.commentId !== commentId)
        
        await review.save()

        const formattedReview = await ReviewDatabase.findById(reviewId)
        const formattedReviewComments = formattedReview.comments
        return res.status(201).json(formattedReviewComments)
    } catch (error) {
        console.log(error)
        return res.status(404).json({error: error.message})
    }
}

export const changeRating = async(req, res) => {
    try {
        const { reviewId, newRating } = req.body
        
        ReviewDatabase.findOneAndUpdate(
            { "_id": reviewId },
            { $set: { "rating": newRating } }
        )
        .catch(error => console.log(error))

        const formattedReview = await ReviewDatabase.findById(reviewId)
        console.log(formattedReview)
        return res.status(201).json(formattedReview)
    } catch (error) {
        console.log(error)
        return res.status(404).json({error: error.message})
    }
}

export const likeReviewComment = async (req, res) => {
    try {
        const { userId, reviewId, commentId } = req.body
        console.log(req.body)
        const review = await ReviewDatabase.findById(reviewId)
        const comment = review.comments.find(comment => comment.commentId === commentId)
        console.log(comment)
        const likesMap = new Map(Object.entries(comment.likes))
        const isLiked = likesMap.get(userId)

        if(isLiked) {
            likesMap.delete(userId)
            console.log("unliking...")
        } else {
            likesMap.set(userId, true)
            console.log("liking...")
        }

        //FINDING AND UPDATING THE LIKED OR UNLIKED COMMENT
        ReviewDatabase.findOneAndUpdate(
            { _id: reviewId, "comments.commentId": commentId, },
            { $set: { "comments.$[comment].likes": likesMap } },
            { arrayFilters: [{ "comment.commentId": commentId }] }
        )
        .catch(error => console.log(error))

        const updatedReview = await ReviewDatabase.findById(reviewId)
        const updatedComment = updatedReview.comments.find(comment => comment.commentId === commentId)
        console.log("updatedComment", updatedComment)
        res.status(200).json(updatedComment)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
} 

export const addReply = async (req, res) => {
    try {
        const { replyerId, reviewId, commentId, reply } = req.body
  
        console.log(req.body)
        const newReply = {
            "replyId": nanoid(),
            "replyerId": replyerId,
            "replyText": reply,
            "dateCreated": new Date()
        }
        
        ReviewDatabase.findOneAndUpdate(
            { _id: reviewId, 'comments.commentId': commentId },
            { $push: { 'comments.$.replies': newReply } },
            { new: true }
            )
            .then((updatedDocument) => console.log(updatedDocument))
            .catch((error) => console.log(error))
  
        const formattedReview = await ReviewDatabase.findById(reviewId)
        const formattedComment = formattedReview.comments.find(comment => comment.commentId === commentId)

        return res.status(201).json(formattedComment)
    } catch (error) {
        console.log(error)
        return res.status(404).json({error: error.message})
    }
}

export const deleteReply = async (req, res) => {
    try {
        const { replyId, reviewId, commentId } = req.body

        ReviewDatabase.updateOne(
        { _id: reviewId, 'comments.commentId': commentId },
        { $pull: { 'comments.$.replies': {replyId: replyId} } },
        { new: true }
        )
        .then((updatedDocument) => {
        console.log(updatedDocument);
        })
        .catch((error) => {
        console.log(error);
        });

        const formattedReview = await ReviewDatabase.findById(reviewId)
        const updatedComment = formattedReview.comments.find(comment => comment.commentId === commentId).replies
        return res.status(201).json(updatedComment)
    } catch (error) {
        console.log(error)
        return res.status(404).json({error: error.message})
    }
}