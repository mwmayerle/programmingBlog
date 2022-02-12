import React from 'react'

import { API } from '../utilities/api.js';
import styles from './LoginForm.module.scss';

const LoginForm = props => {
  const handleLogInChange = (event) => {
    props.setLoginData({
      ...props.loginData,
      [event.target.id]: event.target.value
    })
  }
  
  return (
    <div className={styles.loginFormContainer}>
      <form className={styles.loginForm}>
        <label htmlFor='email'>Email:</label>
        <input
          id='email'
          type='email'
          name='email'
          onChange={event => handleLogInChange(event) }
        >
        </input>
        <label htmlFor='password'>Password:</label>
        <input 
          id='password'
          type='password'
          name='password'
          onChange={event => handleLogInChange(event) }
        >
        </input>
        <button onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          
          API.login(props.loginData).then((response) => {
            props.setLoggedIn(response.loggedIn)
            props.setLoginData( { email: null, password: null } )
            props.setShowForm(false)
          })
        }}>
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginForm;