import React from 'react';
import { Link } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import routes from '../constants/routes.json';
import styles from './Home.css';

export default function Home() {
  const testWorker = () => {
    ipcRenderer.send('test');
  };

  return (
    <div className={styles.container} data-tid="container">
      <h2>Home</h2>
      <Link to={routes.COUNTER}>to Counter</Link>
      <button
        style={{ width: '100px', height: '40px', fontSize: '25px' }}
        onClick={() => testWorker()}
      >
        Test
      </button>
    </div>
  );
}
