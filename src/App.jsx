import React, { useState, useEffect } from 'react'
import Search from './assets/components/search'
import Spinner from './assets/components/spinner'
import MovieCard from './assets/components/MovieCard'
import { useDebounce } from 'react-use'
import { updateSearchCount, getSearchHistory } from './appwrite'

const API_KEY = '23b556389baa6512bc64135681503557';
const API_URL = 'https://api.themoviedb.org/3';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}&language=en-US&page=1`
        : `${API_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=en-US&page=1`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (!data.results) {
        throw new Error('No movies found');
      }

      setMoviesList(data.results);
      
      // Only update search count if we have a query and results
      if (query && data.results.length > 0) {
        try {
          await updateSearchCount(query, data.results[0]);
        } catch (error) {
          // Log the error but don't show it to the user since it's not critical
          console.error('Error updating search count:', error);
        }
      }

    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <div className="pattern">
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Banner Hero" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className='mt-[40px]'>{searchTerm ? 'Search Results' : 'Popular Movies'}</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <div className="flex flex-col items-center justify-center mt-10 space-y-4">
              {/* <img src="/no-movie.png" alt="No movies found" className="w-64 h-64 object-contain opacity-80" /> */}
              <div className="text-center">
                <p className="text-red-500 text-xl font-semibold mb-2">{errorMessage}</p>
                <p className="text-light-200 text-sm">Please try searching with a different keyword</p>
              </div>
            </div>
          ) : moviesList.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-10 space-y-4">
              {/* <img src="/no-movie.png" alt="No movies found" className="w-64 h-64 object-contain opacity-80" /> */}
              <div className="text-center">
                <p className="text-light-200 text-xl font-semibold mb-2">No movies found</p>
                <p className="text-light-200 text-sm">Try adjusting your search to find what you're looking for</p>
              </div>
            </div>
          ) : (
            <ul>
              {moviesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
