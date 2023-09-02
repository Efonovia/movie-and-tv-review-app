import mongoose from "mongoose";

const CollectionSchema = mongoose.Schema({
    collectionId: {
        type: Number,
        required: true
    },
    likes: {
        type: Map,
        of: Boolean,
    },
    watches: {
        type: Map,
        of: Boolean,
    },
}, { timestamps: true })

const Collection = mongoose.model("Collection", CollectionSchema)
export default Collection