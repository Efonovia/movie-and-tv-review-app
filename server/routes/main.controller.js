import CollectionDatabase from "../models/collection.mongo.js"


const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyODZmYzVmYTZjMDMzMGYwYWVmMzBiYTgxYmMxOGNkZiIsInN1YiI6IjY0ZGY1NGUzYWFlYzcxMDNmN2UzNmQxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._oVjlcjEZ3O6MCgP6an-XA2jZHFvi2bNr-wQuZfiTRs'
  }
}

export const getCollectionsBySearch = async(req, res) => {
    try {
        const searchQuery = req.query.searchQuery
        console.log(searchQuery)
          
          try {
            const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${searchQuery}&include_adult=false&page=1`, options)
            return res.status(200).json(await response.json())
        } catch (error) {
            return res.status(404).json({error: error.message})
        }

    } catch (error) {
        return res.status(500).json({error: error.message})   
    }
}

export const getCollectionById = async(req, res) => {
  let url
  try {
      console.log(req.query)
      const { collectionId, collectionType } = req.query
        
      try {
        if(collectionType === "tv") {
          url = `https://api.themoviedb.org/3/tv/${collectionId}`
        } else if(collectionType === "movie") {
          url = `https://api.themoviedb.org/3/movie/${collectionId}`
        }
        const response = await fetch(url, options)
        return res.status(200).json(await response.json())
      } catch (error) {
          return res.status(404).json({error: error.message})
      }

  } catch (error) {
      return res.status(500).json({error: error.message})   
  }
}

export const getAllCollections = async (req, res) => {
  try {
      return res.status(200).json(await CollectionDatabase.find({}, { '_id': 0, '__v': 0 }))
  } catch (error) {
      return res.staus(404).json({error: error.message})
  }
}

export const getCollection = async (req, res) => {
  try {
      const { id } = req.params
      const collection = await CollectionDatabase.findById(id)
      return res.status(200).json(collection)
  } catch (error) {
      return res.status(404).json({error: error.message})
  }
}

export const toggleCollectionEngagement = async(req, res) => {
  const { userId, collectionId, engagementType } = req.body
  CollectionDatabase.findOne({ collectionId })
  .then((collection) => {
    if (collection) {
      console.log("collection exists. updating accordingly...")
      console.log(collection); // Found collection
      const isEngaged = collection[engagementType].get(userId)

      if(isEngaged) {
        console.log("unengaging...")
        collection[engagementType].delete(userId)
      } else {
        console.log("engaging...")
        collection[engagementType].set(userId, true)
      }

    //FINDING AND UPDATING THE engaged OR unengaged USER
    (async function updateCollection() {
      const updatedCollection = await CollectionDatabase.findOneAndUpdate(
          { collectionId },
          { [engagementType]: collection[engagementType] },
          { new: true }
      )

      // console.log(await updatedCollection)
      return res.status(201).json(await updatedCollection)
    })()

    } else {
        console.log(`Collection with collectionId ${collectionId} not found.`);
        console.log("creating new one...")

        const newCollection = new CollectionDatabase({
          collectionId,
          likes: engagementType === "likes" ? {[userId]: true} : {},
          watches: engagementType === "watches" ? {[userId]: true} : {},
        })

        newCollection.save().then(() => {
          console.log('New collection added successfully');
        }).catch((error) => {
            console.log("error while saving collection " + error);
          });

          return res.status(201).json(newCollection)
    }

  })
  .catch((error) => {
    console.log(`Error finding collection with id ${collectionId}: ${error}`);
    return res.status(500).json({error: error.message})
  });
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
          collection.watchList.create(id, true)
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
        console.log(`Error finding collection with id ${collectionId}: ${error}`);
        return res.status(500).json({error: error.message})
      });

      const user = await UserDatabase.findById(id)
      const collection = await CollectionDatabase.findOne({ collectionId })
      
      user.watchList.push({ collectionId, collectionType })
      await user.save()
      const updatedCollection = await CollectionDatabase.findOneAndUpdate(
        { collectionId },
        { watchList: collection.watchList },
        { new: true }
      )

      console.log(updatedCollection)
      const formattedUser = await UserDatabase.findById(id)
      const newitem = formattedUser.watchList.find(item => item.collectionId === collectionId)
      return res.status(201).json(newitem)
  } catch (error) {
      console.log(error)
      return res.status(404).json({error: error.message})
  }
}