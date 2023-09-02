import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema({
    collectionId: {
        type: Number,
        required: true
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
    },
    comments: {
        type: Array,
        default: [],
    }
}, { timestamps: true })

const Review = mongoose.model("Review", ReviewSchema)
export default Review