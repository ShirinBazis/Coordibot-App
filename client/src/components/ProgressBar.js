import React, { useEffect, useState } from 'react'
import Circle from './Circle'
import '../css/ProgressBar.css'

function ProgressBar() {
    const [active, setActive] = useState(0)
    const [circle] = useState(4)
    const [width, setWidth] = useState(0)
    useEffect(() => {
        setWidth(100/(circle-1) * active)
    }, [active, circle])

    const arr = [];
    for (let i = 0; i < circle; i++) {
        arr.push(<Circle children={i} classname={i <= active ? "circle active" : "circle"} key={i} />)
    }

    const handlePrev = (e) => {
        e.preventDefault()
        if (active <= 0)
            setActive(0)
        else
            setActive(active - 1)

    }
    const handleNext = (e) => {
        e.preventDefault()
        if (active >= circle - 1)
            setActive(circle - 1)
        else
            setActive(active + 1)
    }




    return (
        <div className='content-progress-bar'>
            <div className='progressbar'>
                <div className='progress' style={{width: width + "%"}}></div>
                {arr}
            </div>
            <button disabled={active > 0 ? false : true} onClick={(e) => { handlePrev(e) }}>prev</button>
            <button disabled={active >= circle - 1 ? true : false} onClick={(e) => { handleNext(e) }}>next</button>
        </div>
    )
}

export default ProgressBar