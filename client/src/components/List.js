import React, { useEffect, useState } from 'react'
import ListItem from './ListItem';
import { NOTIFIED_URL } from '../pages/consts'

function List({ optionalLecturers, progress }) {
    const [names, setNames] = useState([]);
    const [notified, setNotified] = useState([]);

    const lecturers = {
        "Talya Eden": "303",
        "Liam Roditty": "304",
        "Ester Ezra": "305",
        "Ely Porat": "306",
        "Arnold Filtser": "307",
        "Tsvi Kopelowitz": "308",
        "Amihood Amir": "310",
        "Sarit Kraus": "315",
        "David Sarne": "316",
        "Yoni Zohar": "319",
        "Noa Agmon": "320",
        "Gal Kaminka": "321",
        "Reuth Mirsky": "322",
        "Alex Shleyfman": "323",
        "Hana Weitman": "324"
      };
      
      
    React.useEffect(() => {
        const fetchData = () => {
            fetch(NOTIFIED_URL)
                .then(response => response.json())
                .then(data => {
                    if (data.data.notified !== "") {
                    let notified = data.data.notified.split(',');
                    setNotified(notified);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        };
        let invited = optionalLecturers.map((lecturer) => { return lecturer.name });
        setNames(invited);
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);
    let arr = names.map((name, index) => {
        return (
            <ListItem key={index} text={name} checked={notified.includes(lecturers[name])} />
        )
    })
    return (
        <div id="checklist">
            {arr}
        </div>
    )
}

export default List