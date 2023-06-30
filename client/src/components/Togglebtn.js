import React from 'react'

function Togglebtn({isAvailable}) {
    return (
        <div style={{pointerEvents: 'none'}}>
            <label className="switch">
                <input type="checkbox" checked={isAvailable} disabled></input>
                <div className="slider"></div>
                <div className="slider-card">
                    <div className="slider-card-face slider-card-front"></div>
                    <div className="slider-card-face slider-card-back"></div>
                </div>
            </label>
        </div>
    )
}

export default Togglebtn