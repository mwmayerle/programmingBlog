
import React, { useEffect, useState } from 'react'
import Section from './Section'
import styles from './MainPage.module.scss';

const MainPage = props => {
  // Related Posts Links ******************************** //
  let columnA = []
  let columnB = []
  let columnC = []

  if (props.relatedPostData) {// relatedPostData looks like [[id, title], [id, title]...]
    const buttons = props.relatedPostData.map((relatedPost, index) => {
      return (
        <button
          className={styles.relatedPostLink}
          key={`${index}-${relatedPost[0]}`}
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

  if (props.editingPost) {
    return (
      <div 
        className={styles.mainContainer}
      >
        <form className={styles.formContainer} onSubmit={(event) => event.preventDefault()}>

          <div className={styles.formRow}>
            <label htmlFor="postTitle">
              Title:
              <input 
                id="selectedPostTitle"
                type="text"
                value={props.postTitle}
                onChange={event => props.handleChange(event)}
                />
            </label>
          </div>

          <div className={styles.formRow}>
            <label>
              Tags:
              <input 
                id="selectedPostTags"
                type="text"
                placeholder="Separate tags with a comma"
                value={
                  Array.isArray(props.postTags) ? 
                    props.postTags.toString() : 
                    props.postTags
                }
                onChange={event => props.handleChange(event)}
              />
            </label>
          </div>
          
          <div className={styles.formRow}>
          <label>
            Topic:
          </label>
            <select
              id="postTopicId"
              defaultValue={props.postTopicId}
              onChange={(event) => props.handleInputChange(event)}
              required
            >
              {props.navBarTopicData && (
                props.navBarTopicData.map((topic) => {
                  return (
                    <option
                      key={`${topic[0]}-${topic[1]}`}
                      value={topic[0]}
                    >
                      {topic[1]}
                    </option>
                  ) 
                })
              )}
            </select>
          </div>

          {props.postSections && (
            props.postSections.map((postSection, index) => {
              return (
                <div
                  className={styles.formPostSection}
                  key={`${postSection.id}-${index}`}
                >
                  <Section
                    key={`${postSection.id}-${index}`}
                    body={postSection.body}
                    id={postSection.id}
                    position={postSection.position}
                    postId={postSection.post_id}
                    type={postSection.section_type}
                    editingPost={props.editingPost}
                    draggable={props.draggable}
                    handleSectionDelete={props.handleSectionDelete}
                    handleDragStart={props.handleDragStart}
                    handleDragOver={props.handleDragOver}
                    handleDrop={props.handleDrop}
                    handleSectionChange={props.handleSectionChange}
                    removeUnpersistedSectionremoveUnpersistedSection
                    updateSectionPositions={props.updateSectionPositions}
                  />

                  <hr />
                </div>
              )
            })
          )}
          <div className={styles.formButtons}>
            <input 
              className={styles.submitButton}
              onClick={(event) => {
                event.stopPropagation()
                !!props.postId ? props.updatePost(props) : props.createPost(props)
              }}
              type="submit"
              value="Submit"
            />
             <button
              type="button" 
              className={styles.submitButton}
              onClick={props.addPostSection}
            >
              Add Section
            </button>
            <button
              type="button" 
              className={styles.submitButton}
              onClick={(event) => {
                event.stopPropagation()
                props.stopEditingPost()
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  } else {
    return (
      <div className={styles.mainContainer}>
        {props.postTitle && (
          <>
            <h1>
              {props.postTitle}
            </h1>
            <div className={styles.tagsContainer}>
              {props.postTags && props.postTags.map((tag, index) => {
                return (
                  <div 
                    className={styles.tag}
                    key={`${tag}-${index}`}
                  >
                    {tag}
                  </div>
                )
              })}
            </div>
      
            <hr />

            {props.postSections && (
              props.postSections.map((postSection, index) => {
                return (
                  <Section
                    key={`${postSection.id}-${index}`}
                    body={postSection.body}
                    id={postSection.id}
                    position={postSection.position}
                    postId={postSection.post_id}
                    type={postSection.section_type}
                    editingPost={props.editingPost}
                    handleDragStart={props.handleDragStart}
                    handleDragOver={props.handleDragOver}
                    handleDrop={props.handleDrop}
                    updateSectionPositions={props.updateSectionPositions}
                  />
                )
              })
            )}
            <hr />
          </>
        )}

        {props.relatedPostData && !!props.relatedPostData.length && (
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
        )}

        {props.loggedIn && (
          <>
            <div className={styles.bottomButtons}>
              <button
                type="button" 
                className={styles.bottomButton}
                onClick={props.newPost}
              >
                New Post
              </button>
              {props.postId && (
                <>
                  <button
                    type="button" 
                    className={styles.bottomButton}
                    onClick={(event) => {
                      event.preventDefault()
                      props.startEditingPost()
                    }}
                  >
                    Edit Post
                  </button>
                  <button
                    type="button" 
                    className={styles.bottomButton}
                    onClick={(event) => {
                      event.preventDefault()
                      if (confirm('Are you sure you want to delete this post?')) {
                        props.deletePost(props.postId)
                      }
                    }}
                  >
                    Delete Post
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    )
  }
};

export default MainPage;