import React from 'react'
import styles from './Root.module.scss'

const Banner = (props) => {
  return (
    <div 
      className={styles.banner}
      onClick={() => props.wipePostData() } // Reset almost everything and go to the homepage
      >
    <i>
      <span className={styles.red}>this</span>
      <span className={styles.teal}>.</span>
      <span className={styles.blue}>killMe</span>
      <span className={styles.teal}>();</span>
    </i>
  </div>
  )
}

export default Banner;