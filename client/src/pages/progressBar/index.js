import React from 'react';
import './index.css';

const ProgressBar = () => {
  React.useEffect(() => {
    const fetchData = () => {
      fetch('https://api.example.com/data')
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

  const Bar = ({ progress }) => {
    return (
      <div className="progress-bar">
        <div className="fill" style={{ width: `${progress}%` }}>
          <div className="progress-text">{progress}%</div>
        </div>
      </div>
    );
  };

  return (
    <div className="centered-div">
      <Bar progress={80} />
    </div>
  );
};

export default ProgressBar;
