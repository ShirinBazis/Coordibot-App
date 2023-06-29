import React from 'react';
import { PROGRESS_URL } from '../consts'
import './index.css';

const ProgressBar = () => {
  const [progress, setProgress] = React.useState(65);
  React.useEffect(() => {
    const fetchData = () => {
      fetch(PROGRESS_URL)
        .then(response => response.json())
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const Bar = () => {
    return (
      <div className="progress-bar">
        {progress==0 && <div className='label_0'>0%</div>}
        <div className="fill" style={{ width: `${progress}%` }}>
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
    </div>
  );
};

export default ProgressBar;
