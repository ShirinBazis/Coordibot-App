import React, { useState } from 'react'
import ListItem from './ListItem';

function List() {
    const [names, setNames] = useState([]);
    const [notified, setNotified] = useState([]);


    React.useEffect(() => {
        const fetchData = () => {
          fetch(PROGRESS_URL)
            .then(response => response.json())
            .then(data => {
              console.log(data.data.notified)
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
    arr = names.map((name, index) => {
        return (
            <ListItem key={index} text={name} checked={notified.includes(name)} />
        )
    })
    return (
        <div id="checklist">
            {arr}
        </div>
    )
}

export default List