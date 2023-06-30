import React from 'react'

function ListItem({ text, checked }) {
    return (
        <>
            <input checked={checked} type="checkbox" disabled></input>
            <label>{text}</label>
        </>
    )
}

export default ListItem