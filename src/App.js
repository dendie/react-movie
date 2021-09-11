import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './app.module.css';

import Search from './components/Search';
import MovieList from './components/MovieList';
import ModalImage from './components/Modal/ModalImage';
import ModalDetail from './components/Modal/ModalDetail';
import Spinner from './components/Spinner';

import movieApi from './service/movieApi';

import useInfiniteScroll from './hooks/infiniteScroll';

import {
  setMovieList as setMovieListAction,
  setMovieSearchName as setMovieSearchNameAction
} from './redux/actions/movie';
import movieRL from './redux/logic/movie';

const App = ({ movie, movieSearchName, setMovieList, setMovieSearchName }) => {
  const [movieList, setMovieListState] = useState([]);
  const [movieTitle, setMovieTitle] = useState('');
  const [isOpenModalImage, setOpenModalImage] = useState(false);
  const [isOpenModalDetail, setOpenModalDetail] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [movieId, setMovieId] = useState('');
  const [movieDetail, setMovieDetail] = useState({});
  const [isMovieListLoading, setMovieListLoading] = useState(false);
  const [isMovieDetailloading, setMovieDetailLoading] = useState(false);
  const [isSliceList, setSliceList] = useState(false);
  const [page, setPage] = useState(1);

  const fetchMovieList = (
    title,
    pagination,
    isPrefetch,
    onFinish = () => {},
    onComplete = () => {}
  ) => {
    movieApi
      .getMovieList(title, pagination)
      .then(res => {
        if (res.data.Response === 'True') {
          setMovieList(
            movieRL.addMovieList(title, res.data.Search, isPrefetch)
          );
        }
      })
      .then(() => onFinish())
      .finally(() => onComplete());
  };

  const fetchMoreMovieList = () => {
    setTimeout(() => {
      if (movieList.length !== movie[movieSearchName].length) {
        setSliceList(false);
        const remainsLocalMovie = movie[movieSearchName].slice(
          movie[movieSearchName].length - 5
        );
        setMovieListState(prevState => [...prevState, ...remainsLocalMovie]);
        setIsFetching(false);
      } else {
        setPage(state => state + 1);
        fetchMovieList(
          movieSearchName,
          page + 1,
          false,
          () => setSliceList(true),
          () => setIsFetching(false)
        );
      }
    }, 1500);
  };

  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreMovieList);

  const handleSearchMovie = e => {
    if (e.key === 'Enter') {
      setPage(1);
      setMovieListLoading(true);
      setMovieSearchName(movieTitle);
      fetchMovieList(
        movieTitle,
        1,
        true,
        () => setSliceList(true),
        () => setMovieListLoading(false)
      );
    }
  };

  const handleChangeMovie = e => {
    const title = e.target.value;
    setMovieTitle(title);
  };

  const handleOpenModalImage = imgSrc => {
    setModalImageSrc(imgSrc);
    setOpenModalImage(true);
  };

  const handleCloseModalImage = () => {
    setOpenModalImage(false);
    setTimeout(() => {
      setModalImageSrc('');
    }, 400);
  };

  const handleOpenModalDetail = id => {
    setOpenModalDetail(true);
    setMovieId(id);
  };

  const handleCloseModalDetail = () => {
    setOpenModalDetail(false);
    setTimeout(() => {
      setMovieDetail({});
      setMovieId('');
    }, 400);
  };

  useEffect(() => {
    const handleGetMovieDetail = () => {
      setMovieDetailLoading(true);
      movieApi
        .getMovieDetail(movieId)
        .then(res => setMovieDetail(res.data))
        .finally(() => setMovieDetailLoading(false));
    };
    if (movieId) handleGetMovieDetail();
  }, [movieId]);

  useEffect(() => {
    if (isSliceList) {
      const selectedMovie = movie[movieSearchName].slice(
        0,
        movie[movieSearchName].length - 5
      );
      setMovieListState(selectedMovie);
      setSliceList(false);
    }
  }, [isSliceList]);

  return (
    <div className={styles.container}>
      <ModalDetail
        open={isOpenModalDetail}
        isLoading={isMovieDetailloading}
        onClose={handleCloseModalDetail}
        movieData={movieDetail}
      />
      <ModalImage
        open={isOpenModalImage}
        onClose={handleCloseModalImage}
        imgSrc={modalImageSrc}
      />
      <section className={styles.header}>
        <p>MOVIEBIT</p>
      </section>
      <section className={styles.wrapper}>
        <h1>Search Movie</h1>
        <Search
          onChange={handleChangeMovie}
          onKeyPress={handleSearchMovie}
          placeholder="Search for movie"
        />
        {isMovieListLoading && <Spinner />}
        {movieList.length === 0 && !isMovieListLoading && (
          <p className={`${styles['no-movie']}`}>No movies</p>
        )}
        <MovieList
          movieList={movieList}
          onOpenModalImage={handleOpenModalImage}
          onOpenMovieDetail={handleOpenModalDetail}
        />
        {isFetching && (
          <p className={`${styles.fetch}`}>Fetching more movies</p>
        )}
      </section>
    </div>
  );
};

App.propTypes = {
  movie: PropTypes.shape({}),
  movieSearchName: PropTypes.string,
  setMovieList: PropTypes.func,
  setMovieSearchName: PropTypes.func
};

App.defaultProps = {
  movie: {},
  movieSearchName: '',
  setMovieList: () => {},
  setMovieSearchName: () => {}
};

const mapStateToProps = state => {
  const { movie } = state;
  const { movieSearchName } = movie;
  return { movie, movieSearchName };
};

const mapDispatchToProps = dispatch => {
  return {
    setMovieList: (movieName, movieData) =>
      dispatch(setMovieListAction(movieName, movieData)),
    setMovieSearchName: movieName =>
      dispatch(setMovieSearchNameAction(movieName))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
