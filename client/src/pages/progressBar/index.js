import React from 'react';
import { PROGRESS_URL } from '../consts'
import './index.css';
import List from '../../components/List';
import { useNavigate } from "react-router-dom";

const ProgressBar = ({ optionalLecturers }) => {
  const navigate = useNavigate();
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
    <>
      <div className="progress-container">
        <div className="centered-div">
          <div className='progress-dicription'>
            Robot Progress:
          </div>
          {progress >= 0 && <Bar />}
          {progress < 0 && (<span>The robot encountered a problem</span>)}
          <List optionalLecturers={optionalLecturers} progress={progress} />
        </div>
      </div>
      <br></br>
      <button className="backbutton" onClick={(e) => navigate('/meetings')}>
        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
          <path
            d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"
            fill="#FFFFFF"></path>
        </svg>
        <span>Back to Make meeting</span>
      </button>
    </>

  );
};

export default ProgressBar;
