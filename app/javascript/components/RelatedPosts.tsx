import React from 'react'
import styles from './MainPage.module.scss'

const RelatedPosts = (props) => {
  let columnA = []
  let columnB = []
  let columnC = []

  if (props.relatedPostData) {// relatedPostData looks like [[id, title], [id, title]...]
    const buttons = props.relatedPostData.map((relatedPost, index) => {
      return (
        <button
          className={styles.relatedPostLink}
          key={`${index}-${relatedPost[0]}-button`}
          onClick={props.getPostData.bind(null, relatedPost[0])}
        >
          {relatedPost[1]}
        </button>
      )
    })

    for (let i = 0; i < buttons.length; i++) {
      if (i % 2 === 0) { // 0 % 2 is 0, so we want this first
        columnA.push(buttons[i])
      } else {
        (i % 3 === 0) ? columnC.push(buttons[i]) : columnB.push(buttons[i])
      }
    }
  }

  return (
    <>
      <p className={styles.relatedPostsTitle}>Related Posts</p>
      <div className={styles.relatedPostsContainer}>
        {columnA && (
          <ul className={styles.column}>
            {columnA.map((button, idx) => <li key={`A-${idx}`}>{button}</li> )}
          </ul>
        )}
        {columnB && (
          <ul className={styles.column}>
            {columnB.map((button, idx) => <li key={`B-${idx}`}>{button}</li> )}
          </ul>
        )}
        {columnC && (
          <ul className={styles.column}>
            {columnC.map((button, idx) => <li key={`C-${idx}`}>{button}</li> )}
          </ul>
        )}
      </div>
      <hr />
    </>
  )
}

export default RelatedPosts;