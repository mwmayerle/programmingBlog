
import React from 'react'
import Button from './Button'
import RelatedPosts from './RelatedPosts';
import Section from './Section'
import styles from './MainPage.module.scss';

const MainPage = props => {
  if (props.editingPost) {
    return (
      <div className={styles.mainContainer}>
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
              className={styles.postTopicId}
              defaultValue={props.postTopicId}
              onChange={(event) => props.handleInputChange(event)}
              required
            >
              {props.navBarTopicData && (
                props.navBarTopicData.map((topic) => {
                  return <option key={`${topic[0]}-${topic[1]}`} value={topic[0]}>{topic[1]}</option>
                })
              )}
            </select>
          </div>

          {props.postSections && (
            props.postSections.map((postSection, index) => {
              return (
                <div
                  className={styles.formPostSection}
                  key={`postSectionDiv-${postSection.id}-${index}`}
                >
                  <Section
                    key={`editing-section-${postSection.id}-${index}`}
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
            <Button
              onClick={!!props.postId ? () => props.updatePost(props) : () => props.createPost(props)}
              label={!!props.postId ? "Edit Post" : "Create Post"}
            />
            <Button onClick={props.addPostSection} label="Add Section" />
            <Button onClick={props.stopEditingPost} label="Cancel"/>
          </div>
        </form>
      </div>
    )
  } else {
    return (
      <div className={styles.mainContainer}>
        {props.postTitle && (
          <>
            <h1>{props.postTitle}</h1>
            <div className={styles.tagsContainer}>
              {props.postTags && props.postTags.map((tag, index) => {
                return <div className={styles.tag} key={`${tag}-${index}-tag`}>{tag}</div>
              })}
            </div>
      
            <hr />

            {props.postSections && (
              props.postSections.map((postSection, index) => {
                return (
                  <Section
                    key={`${postSection.id}-${index}-section`}
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
          <RelatedPosts relatedPostData={props.relatedPostData}/>
        )}

        {props.loggedIn && (
          <>
            <div className={styles.bottomButtons}>
              <Button onClick={props.newPost} label="New Post" />
              {props.postId && (
                <>
                  <Button 
                    onClick={props.startEditingPost}
                    label="Edit Post"
                  />
                  <Button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this post?')) {
                        props.deletePost(props.postId)
                      }
                    }} 
                    label="Delete Post"
                  />
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