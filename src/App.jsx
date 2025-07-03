import React, { useState, useEffect } from 'react'
import Search from './assets/components/search'

const API_KEY = '23b556389baa6512bc64135681503557';
const API_URL = 'https://api.themoviedb.org/3';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(
        `${API_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=en-US&page=1`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (!data.results) {
        throw new Error('No movies found');
      }

      setMoviesList(data.results);
      setIsLoading(false);

    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="pattern">
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Banner Hero" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <p className='text-white'>Loading...</p>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {moviesList.map((movie) => (
                <p key={movie.id} className='text-white'>{movie.title}</p>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
