import React from 'react';
import PropTypes from 'prop-types';
import styles from './movieList.module.css';
import Card from '../Card';

const MovieList = ({ movieList, onOpenMovieDetail }) => {
  return (
    <div className={`${styles['movie-list']}`}>
      {movieList.map(item => {
        return (
          <Card
            key={item.imdbID}
            id={item.imdbID}
            title={item.Title}
            year={item.Year}
            imgSrc={item.Poster}
            onOpenMovieDetail={onOpenMovieDetail}
          />
        );
      })}
    </div>
  );
};

MovieList.propTypes = {
  movieList: PropTypes.arrayOf(PropTypes.shape({})),
  onOpenModalImage: PropTypes.func,
  onOpenMovieDetail: PropTypes.func
};

MovieList.defaultProps = {
  movieList: [],
  onOpenModalImage: () => {},
  onOpenMovieDetail: () => {}
};

export default MovieList;
