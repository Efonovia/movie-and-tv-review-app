import UserDatabase from "../models/user.mongo.js"
import bcrypt from "bcrypt"


export const getAllUsers = async (req, res) => {
    try {
        return res.status(200).json(await UserDatabase.find({}, { '_id': 0, '__v': 0 }))
    } catch (error) {
        return res.staus(404).json({error: error.message})
    }
}

export const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await UserDatabase.findById(id)
        return res.status(200).json(user)
    } catch (error) {
        return res.status(404).json({error: error.message})
    }
}

export const createNewUser = async (req, res) => {
    console.log("creating...")
    try {
      const {
        username,
        email,
        password,
        picturePath
      } = req.body
  
      console.log(req.body)
  
      const salt = await bcrypt.genSalt()
      const passwordHash = await bcrypt.hash(password, salt)
  
      UserDatabase.findOne({ email: email })
      .then((user) => {
        if (user) {
          console.log(user); // Found user
          return res.status(200).json({exists: true, body: user})
        } else {
            console.log(`User with email ${email} not found.`);
  
            const newUser = new UserDatabase({
              username,
              email,
              password: passwordHash,
              picturePath: picturePath || "",
              favourites: {},
              watchList: {},
              dateJoined: new Date()
            })
  
            newUser.save().then(() => {
              console.log('New person added successfully');
            }).catch((error) => {
                console.log(error);
              });
  
          return res.status(201).json({exists: false, body: newUser})
        }
      })
      .catch((error) => {
        console.log(`Error finding user with email ${email}: ${error}`);
        return res.status(500).json({error: error.message})
      });
  
    } catch (error) {
      return res.status(500).json({error: error.message})
    }
}

export const toggleToWatchList = async (req, res) => {
  try {
      const { userId, collectionId } = req.body
      const collectionIdStr = JSON.stringify(collectionId)
      const user = await UserDatabase.findById(userId)
      const isWatchListed = user.watchList.get(collectionIdStr)

      if(isWatchListed) {
        user.watchList.delete(collectionIdStr)
      } else {
          user.watchList.set(collectionIdStr, true)
      }

    //FINDING AND UPDATING THE LIKED OR UNLIKED USER
    const updatedUser = await UserDatabase.findByIdAndUpdate(
        userId,
        { watchList: user.watchList },
        { new: true }
    )

      res.status(200).json(updatedUser)
  } catch (error) {
      res.status(404).json({ error: error.message })
  }
}