import { useEffect, useRef, useState } from "react"
import styles from "../select.module.css"

export const SelectOption = {
    name: "",
    room: ""
}

const MultipleSelectProps = {
    multiple: true,
    value: [],
    onChange: (value) => { }
}

const SingleSelectProps = {
    multiple: false,
    value: undefined,
    onChange: (value) => { }
}


const SelectProps = {
    options: []
} & (SingleSelectProps | MultipleSelectProps)

export default function Select({ multiple, value, onChange, options, label }) {
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const containerRef = useRef(null);

    function clearOptions() {
        multiple ? onChange([]) : onChange(undefined)
    }

    function selectOption(option) {
        if (multiple) {
            // this option has already been selected before
            if (value.some((o) => o.room === option.room)) {
                onChange(value.filter((o) => o !== option))
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
            <label className="col-sm-4 col-form-label">{label}</label>
            <div className="col-sm-6">

                <div
                    ref={containerRef}
                    onBlur={() => setIsOpen(false)}
                    onClick={() => setIsOpen(prev => !prev)}
                    tabIndex={0}
                    className={styles.container}
                >
                    <span className={styles.value}>
                        {multiple
                            ? value.map(v => (
                                <button
                                    key={v.room}
                                    onClick={e => {
                                        e.stopPropagation()
                                        selectOption(v)
                                    }}
                                    className={styles["option-badge"]}
                                >
                                    {v.name}
                                    <span className={styles["remove-btn"]}>&times;</span>
                                </button>
                            ))
                            : value?.room}
                    </span>
                    {multiple
                        ?
                        <button
                            onClick={e => {
                                e.stopPropagation()
                                clearOptions()
                            }}
                            className={styles["clear-btn"]}
                        >
                            &times;
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
                                key={option.room}
                                className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ""
                                    } ${index === highlightedIndex ? styles.highlighted : ""}`}
                            >
                               {multiple ? option.name : option.room}
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    )
}