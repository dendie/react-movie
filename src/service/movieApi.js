import axios from './axios';

const { getInstance, routes } = axios;

const getMovieList = (movieName, page) => {
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.movieList(movieName, page))
      .then(res => resolve(res))
      .catch(reject);
  });
};

const getMovieDetail = movieId => {
  return new Promise((resolve, reject) => {
    getInstance()
      .get(routes.movieDetail(movieId))
      .then(res => resolve(res))
      .catch(reject);
  });
};

export default {
  getMovieList,
  getMovieDetail
};
