import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 2,
        max: 50
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 50,
    },
    picturePath: {
        type: String,
        default: "",
    },
    favourites: {
        type: Array,
        default: [],
    },
    likes: {
        type: Array,
        default: [],
    },
    watches: {
        type: Array,
        default: [],
    },
    watchList: {
        type: Array,
        default: [],
    },
    dateJoined: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const User = mongoose.model("User", UserSchema)
export default User