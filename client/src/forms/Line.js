import React, {useState} from 'react'

function Line({text, flag, type}) {
    let out_text = "Login successful"
    let color = "green"
    if (type == "error") {
        out_text = "Wrong password or username"
        color = "red"
    }
    if (type == "server_error") {
        out_text = "There was a problem connecting to the server"
        color = "red"
    }
    if (type == "success" || type == "server_error" || type == "error") {
        return (
            <div className="terminal_promt">
                <span className="terminal_user">CoordiBot@{type}:</span>
                <span className="terminal_location">~</span>
                <span className="terminal_bling" style={{color: color}}>{out_text}</span>
            </div>
        )
    }
    return (
        <div className="terminal_promt">
            <span className="terminal_user">CoordiBot@{type}:</span>
            <span className="terminal_location">~</span>
            <span className="terminal_bling">{flag && <span className="terminal_bling">$ </span>} {text}</span>
            {flag && <span style={{marginTop: '0.3%'}} className="terminal_cursor"></span>}
        </div>
    )
}

export default Line