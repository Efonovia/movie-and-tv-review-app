import React from 'react';
import { httpSearchByCollection } from './hooks/requests.hooks';


function App() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [searchResults, setSearchResults] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false);

    const searchResultsElements= searchResults.sort((a,b) => b.popularity - a.popularity).map(result => {
      if(["tv", "movie"].includes(result.media_type)) {
        return <div key={result.id}>
          <h1>{result.title || result.name}</h1>
          {result.poster_path && <img width={100} height={150} alt="" src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}></img>}
          {result.backdrop_path && <img width={100} height={150} alt="" src={`https://image.tmdb.org/t/p/w500${result.backdrop_path}`}></img>}
          <hr></hr>
        </div>
      } else {
        return false
      }
    }) 

    function onSearchChange(event) {
      setSearchQuery(event.target.value)
    }

    async function makeSearch() {
      setIsLoading(true)
      console.log(searchQuery)
      try {
        const response = await httpSearchByCollection(searchQuery)
        console.log("response", response)
        setSearchResults(response.results)
        console.log(response.results)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
      
    }

    // React.useEffect(() => {
    //   console.log("useeffect")
    //   console.log(searchResults)
    // }, [searchResults])
 
    return <>
      <input name='search' type='search' onChange={onSearchChange} value={searchQuery}></input><input type='button' onClick={makeSearch} value={"Search"}></input>
      {isLoading && <p>Loading...</p>}
      <div>{searchResults.length > 0 ? searchResultsElements : <p>NO results were found</p>}</div>
    </>
}


export default App