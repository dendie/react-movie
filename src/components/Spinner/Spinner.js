import React from 'react';
import styles from './spinner.module.css';

const Spinner = () => {
  return (
    <div className={styles.container}>
      {Array(12)
        .fill()
        .map((data, i) => {
          return <div key={i.toString()} />;
        })}
    </div>
  );
};

export default Spinner;
