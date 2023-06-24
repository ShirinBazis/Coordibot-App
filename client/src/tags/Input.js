import React from 'react';
import { GetError } from '../forms/ValidityErrors';

export default function Input({ inputName, inputType, text, isRequired = "" }) {
    return (
        <div className="row mb-3">
            <div className="col-sm-4 col-form-label">
            <label htmlFor={inputName}>{text}</label>
            {isRequired !== "" ?
                (<label className="required" htmlFor={isRequired}>* Required</label>)
                : null}
            </div>

            <div className="col-sm-6">
                <input className="form-control" id={inputName} type={inputType}></input>
                <div className="hidden"><GetError inputName={inputName} /></div>
            </div>
        </div>
    )
}