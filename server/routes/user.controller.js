import UserDatabase from "../models/user.mongo.js"
import CollectionDatabase from "../models/collection.mongo.js"
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
              favourites: [],
              likes: [],
              watches: [],
              watchList: [],
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

export const addToList = async (req, res) => {
  try {
      const { id } = req.params
      const { collectionId, collectionType, listType } = req.body

      console.log(req.body)

      CollectionDatabase.findOne({ collectionId })
      .then((collection) => {
        if (collection) {
          console.log(collection); // Found collection
          collection[listType].create(id, true)
        } else {
            console.log(`Collection with collectionId ${collectionId} not found.`);
            const newCollection = new CollectionDatabase({
              collectionId,
              likes: listType === "likes" ? {[id]: true} : {},
              watches: listType === "watches" ? {[id]: true} : {},
            })

            newCollection.save().then(() => {
              console.log('New collection added successfully');
            }).catch((error) => {
                console.log(error);
              });
  
        }
      })
      .catch((error) => {
        console.log(`Error finding collection with id ${email}: ${error}`);
        return res.status(500).json({error: error.message})
      });

      const user = await UserDatabase.findById(id)
      const collection = await CollectionDatabase.findOne({ collectionId })
      
      user[listType].push({ collectionId, collectionType })
      await user.save()
      const updatedCollection = await CollectionDatabase.findOneAndUpdate(
        { collectionId },
        { [listType]: collection[listType] },
        { new: true }
      )

      console.log(updatedCollection)
      const formattedUser = await UserDatabase.findById(id)
      const newitem = formattedUser[listType].find(item => item.collectionId === collectionId)
      return res.status(201).json(newitem)
  } catch (error) {
      console.log(error)
      return res.status(404).json({error: error.message})
  }
}

export const removeFromList = async (req, res) => {
  try {
      const { id } = req.params
      const { collectionId, listType } = req.body
      console.log("collectionId: ", collectionId)
      const user = await UserDatabase.findById(id)
      const collection = await CollectionDatabase.findOne({ collectionId })
      console.log(user[listType])
      collection[listType].delete(id)

      const updatedCollection = await CollectionDatabase.findOneAndUpdate(
        { collectionId },
        { [listType]: collection[listType] },
        { new: true }
      )

      console.log(updatedCollection)
      user[listType] = user[listType].filter(item => item.collectionId !== Number(collectionId))
      
      await user.save()

      const formattedUser = await UserDatabase.findById(id)
      const formattedList = formattedUser[listType]
      return res.status(201).json(formattedList)
  } catch (error) {
      console.log(error)
      return res.status(404).json({error: error.message})
  }
}