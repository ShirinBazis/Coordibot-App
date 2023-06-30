import React from 'react';
import { PROGRESS_URL } from '../consts'
import './index.css';
import List from '../../components/List';

const ProgressBar = () => {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const fetchData = () => {
      fetch(PROGRESS_URL)
        .then(response => response.json())
        .then(data => {
          setProgress(data.data.progress)
        })
        .catch(error => {
          setProgress(-1)
          console.error('Error:', error);
        });
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const Bar = () => {
    const fillClassName = progress === 100 ? 'fill-complete' : 'fill';

    return (
      <div className="progress-bar">
        {progress === 0 && <div className='label_0'>0%</div>}
        <div className={fillClassName} style={{ width: `${progress}%` }}>
          {progress && <div className="progress-text">{progress}%</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="centered-div">
      <div className='progress-dicription'>
        Robot Progress:
      </div>
      {progress >= 0 && <Bar />}
      {progress < 0 && (<span>The robot encountered a problem</span>)}
      <List />
    </div>
  );
};

export default ProgressBar;
