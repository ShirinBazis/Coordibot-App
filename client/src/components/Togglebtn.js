import React from 'react'

function Togglebtn({isAvailable}) {
    return (
        <div style={{pointerEvents: 'none'}}>
            <label class="switch">
                <input type="checkbox" checked={isAvailable} disabled></input>
                <div class="slider"></div>
                <div class="slider-card">
                    <div class="slider-card-face slider-card-front"></div>
                    <div class="slider-card-face slider-card-back"></div>
                </div>
            </label>
        </div>
    )
}

export default Togglebtn