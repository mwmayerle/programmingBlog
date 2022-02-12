import React from 'react'
import styles from './Button.module.scss'

const Button = (props) => {
  return (
    <button
      type="button" 
      className={props.className || styles.standard}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        props.onClick()
      }}
    >
      {props.label}
    </button>
  )
}

export default Button;