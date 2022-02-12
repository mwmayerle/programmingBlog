import React from 'react'
import styles from './SideBar.module.scss'

const SideBar = props => {
  return (
    <div className={styles.sideBarContainer}>
      {props.title && (
        <div className={styles.sideBarTitle}>
          <p>{props.title}</p>
        </div>
      )}
      {props.posts && (
        props.posts.map((post, index) => {
          return (
            <button
              className={styles.sideBarLink}
              key={`${index}-sidebar`}
              onClick={props.getPostData.bind(null, post.id)}
            >
              {post.title}
            </button>
          )
        })
      )}
    </div>
  )
}

export default SideBar;