import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet";
import morgan from "morgan";
import { fileURLToPath } from "url";
import mainRouter from "../server/routes/main.route.js";
import userRouter from "./routes/user.route.js";
import ReviewsRouter from "./routes/review.route.js";


// CONFIGURATION
const __filename = fileURLToPath(import.meta.url)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())


//ROUTES
app.get("/", (req, res) => res.send("hello"))
app.use("/collections", mainRouter)
app.use("/users", userRouter)
app.use("/reviews", ReviewsRouter)


//MONGOOSE SETUP
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => app.listen(PORT, () => {
    console.log("Connected to mongo database")
    console.log('Server running at PORT: '+PORT)
}))
.catch(err => console.log(err+ " failed to connect to database"))