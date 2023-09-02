
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