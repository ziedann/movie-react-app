import React, { useState, useEffect } from 'react'
import Search from './assets/components/Search'
import Spinner from './assets/components/Spinner'
import MovieCard from './assets/components/MovieCard'
import { useDebounce } from 'react-use'
import { updateSearchCount, getSearchHistory, getTrendingMovies } from './appwrite'

const API_KEY = '23b556389baa6512bc64135681503557';
const API_URL = 'https://api.themoviedb.org/3';

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [moviesList, setMoviesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [trendingMovies, setTrendingMovies] = useState([]);

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

  const loadTrendingMovies = async () => {
    try {
      const movie = await getTrendingMovies();
      setTrendingMovies(movie);
    } catch (error) {
      console.error('Error loading trending movies:', error);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <div className="pattern">
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Banner Hero" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2 className='text-2xl font-bold my-6'>Trending Movies</h2>
            <ul>
              <div></div>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id} className='hover: cursor-pointer'>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.searchTerm} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* {trendingMovies.length > 0 && (
          <section className="trending-movies">
            <h2 className="text-2xl font-bold my-6">Trending Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {trendingMovies.map((movie, index) => (
                <div key={movie.$id} className="relative bg-dark-200 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                  <div className="absolute top-2 left-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  {movie.poster_url ? (
                    <img 
                      src={movie.poster_url} 
                      alt={movie.searchTerm} 
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <img 
                      src="/no-movie.png" 
                      alt="No poster available" 
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <div className="mb-4 mt-2">
                    <h3 className="text-lg text-light-200 font-semibold">{movie.searchTerm}</h3>
                    <p className="text-sm text-gray-400">Searched {movie.count} times</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )} */}



        <section className="all-movies mt-10">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <div className="flex flex-col items-center justify-center mt-10 space-y-4">
              <div className="text-center">
                <p className="text-red-500 text-xl font-semibold mb-2">{errorMessage}</p>
                <p className="text-light-200 text-sm">Please try searching with a different keyword.</p>
              </div>
            </div>
          ) : moviesList.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-10 space-y-4">
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
