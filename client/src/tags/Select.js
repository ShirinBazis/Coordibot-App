import { useEffect, useRef, useState } from "react"
import styles from "../css/select.module.css"
import { GetError } from '../forms/ValidityErrors';


export const SelectOption = {
    name: "",
    val: ""
}

const MultipleSelectProps = {
    multiple: true,
    value: [],
    onChange: (value) => {
    }
}

const SingleSelectProps = {
    multiple: false,
    value: undefined,
    onChange: (value) => {
    }
}


const SelectProps = {
    options: []
} & (SingleSelectProps | MultipleSelectProps)

export default function Select({ multiple, value, onChange, options, label, isRequired = "" }) {
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const containerRef = useRef(null);


    function clearOptions() {
        // multiple ? onChange([]) : onChange(undefined)
        onChange([])
    }

    const clearOption = (option) => {
        const updatedValue = value.filter(o => o !== option);
        onChange(updatedValue);
    }

    function selectOption(option) {
        if (multiple) {
            // this option has already been selected before
            if (value.some((o) => o.val === option.val)) {
                return
            } else {
                onChange([...value, option])
            }
        } else {
            if (option !== value) onChange(option)
        }
    }

    function isOptionSelected(option) {
        return multiple ? value.includes(option) : option === value
    }

    useEffect(() => {
        if (isOpen) setHighlightedIndex(0)
    }, [isOpen])

    useEffect(() => {
        const handler = (e) => {
            if (e.target !== containerRef.current) return
            switch (e.code) {
                case "Enter":
                case "Space":
                    setIsOpen((prev) => !prev)
                    if (isOpen) selectOption(options[highlightedIndex])
                    break
                case "ArrowUp":
                case "ArrowDown": {
                    if (!isOpen) {
                        setIsOpen(true)
                        break
                    }

                    const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue)
                    }
                    break
                }
                case "Escape":
                    setIsOpen(false)
                    break
                default:
                    break
            }
        }
        const cleanup = () => {
            containerRef.current?.removeEventListener("keydown", handler);
        };

        containerRef.current?.addEventListener("keydown", handler);

        return cleanup;
    }, [isOpen, highlightedIndex, options, selectOption]);

    return (
        <div className="row mb-3">
            <div className="col-sm-4 col-form-label">
            <label htmlFor={label}>{label}</label>
            {isRequired !== "" ?
                (<label className="required" htmlFor={isRequired}>* Required</label>)
                : null}
            </div>

            <div className="col-sm-6">

                <div
                    ref={containerRef}
                    onBlur={() => setIsOpen(false)}
                    onClick={() => setIsOpen(prev => !prev)}
                    tabIndex={0}
                    className={styles.container}
                >
                    <span className={styles.value}>
                        {multiple ? (
                            <div className={styles.selectedOptions}>
                                {value.map((v) => (
                                    <button
                                        key={v.val}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setIsOpen(false)
                                            //setIsOpen((prev) => !prev);
                                            const updatedValue = value.filter(o => o !== v);
                                            onChange(updatedValue);
                                            selectOption(v);
                                            
                                        }}
                                        className={styles["option-badge"]}
                                    >
                                        {v.name}
                                        <span className={styles["remove-btn"]}>&times;</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            value?.val
                        )}
                    </span>

                    {multiple
                        ?
                        <button
                            onClick={e => {
                                e.stopPropagation()
                                e.preventDefault();
                                clearOptions();
                                setIsOpen(false)
                            }}
                            className={styles["clear-btn"]}
                        >&times;
                        </button> : <div className={styles.container}></div>
                    }
                    <div className={styles.divider}></div>
                    <div className={styles.caret}></div>
                    <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
                        {options.map((option, index) => (
                            <li
                                onClick={e => {
                                    e.stopPropagation()
                                    selectOption(option)
                                    setIsOpen(false)
                                }}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                key={option.val}
                                className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ""
                                } ${index === highlightedIndex ? styles.highlighted : ""}`}
                            >
                                {multiple ? option.name : option.val}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="hidden" id={label}><GetError inputName={label} /></div>
            </div >
        </div >
    )
}