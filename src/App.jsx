import React, { useState } from 'react'
import Search from './assets/components/search'

function App() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="/hero.png" alt="Banner Hero" />
            <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          </header>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <h1 className='text-white text-center text-4xl font-bold'>
            {searchTerm}
          </h1>

        </div>
      </div>
    </div>
  )
}

export default App
