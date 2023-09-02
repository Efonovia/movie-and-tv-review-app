const API_URL = "http://localhost:8000"

export const httpSearchByCollection = async (searchQuery) => {
    try {
        const response = await fetch(`${API_URL}/collections/search?searchQuery=${searchQuery}`)
        return await response.json()
      } catch (error) {
        console.log(error)
        alert("something went wrong")
      }
}