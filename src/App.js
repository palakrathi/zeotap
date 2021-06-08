import {useState, useEffect} from "react";
import './App.css';
import { checkIsNotNA } from "./util";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [fetchingState, setFetchingState] = useState(false);
  const [year, setYear] = useState(null);

  const getSearchResults = (year) => {
    fetch(` https://jsonmock.hackerrank.com/api/movies?Year=${year}`)
    .then(res => res.json())
    .then(({ data, total }) => {
      if (total > 0) {
        Promise.all(data.map(({ imdbID }) => {
          return fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=ccf5be36`)
        .then(res => res.json())}))
        .then(response => {
          const moviesData = response.map(({ imdbID, Title, Rated, Released, runtime, Genre, Poster }) => ({
            imdbID,
            title: Title,
            rating: Rated, 
            releaseDate: Released, 
            duration: runtime, 
            genre: Genre, 
            posterImg: checkIsNotNA(Poster) ? Poster : 'https://picsum.photos/id/1038/250/350'
          }));
          setSearchResults(moviesData);
          setFetchingState(false);
        })
      } else setFetchingState(false);
    })
  }

  const searchHandler = (e) => {
    const val = e.target.value;
    if (val && val.length === 4 && Number.isInteger(Number.parseInt(val))) {
      setFetchingState(true);
      setYear(Number.parseInt(val));
    } else { 
      setFetchingState(false);
      setYear(null);
    }
  }

  useEffect(() => {
    if (fetchingState && year) {
      getSearchResults(year);
    }
  }, [fetchingState, year])
  return (
    <div className="App">
      <header className="App-header">
        <input
        disabled={fetchingState}
          type="search"
          placeholder="Search" 
          onChange={searchHandler}
        />
      </header>
      <section className="App-body">
        {searchResults?.map(({imdbID, title, rating, releaseDate, duration, genre, posterImg}) => {
          return (
            <div key={imdbID} className="card">
              <img src={posterImg} alt="" />
              <div className="title">{title}</div>
              <div className="details">
                {checkIsNotNA(rating) && <span>{rating}</span>}
                <span>{releaseDate}</span>
                <span>{duration}</span>
              </div>
              <div className="genre">
                {genre.split(',').map(val => <span key={val} className="tag">{val}</span>)}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  );
}

export default App;
