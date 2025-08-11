import { useState } from "react"
import { Search } from "lucide-react"

export function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onSearch(e.target.value)
        }}
        placeholder="Search your library..."
        className="bg-black/50 border border-gray-600 rounded-full px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 w-80"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    </form>
  )
}
