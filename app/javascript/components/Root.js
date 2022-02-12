import React, { useEffect, useState } from 'react';

import { API } from '../utilities/api.js';
import Banner from './Banner';
import Button from './Button';
import HomePageEntry from './HomePageEntry';
import LoginForm from './LoginForm';
import MainPage from './MainPage';
import NavBarTopic from './NavBarTopic';
import styles from './Root.module.scss';
import SideBar from './SideBar';


const Root = (props) => {
  const [loggedIn, setLoggedIn] = useState(props.loggedIn || false)
  const [count, setCount] = useState(1)
  const [navBarTopicData, setNavBarTopicData] = useState(null)

  const [dragData, setDragData] = useState({
    beingDraggedId: null,
    droppedPosition: null
  })
  
  const [selectedPost, setSelectedPost] = useState({
    editingPost: false,
    postTopicId: null,
    selectedPostId: null,
    selectedPostTitle: null,
    selectedPostTags: null,
    selectedPostSections: []
  })

  const [selectedTopic, setSelectedTopic] = useState({
    selectedTopicId: null,
    selectedTopicTitle: null,
    selectedTopic: null
  })

  const [showForm, setShowForm] = useState(false)
  const [loginData, setLoginData] = useState({
    email: null,
    password: null
  })

  const getHighestPosition = () => {
    if (selectedPost.selectedPostSections.length === 0) {
      return 1
    }

    const positionArray = selectedPost.selectedPostSections.map((postSection) => {
      return parseInt(postSection.position)
    })

    return (
      positionArray.reduce(function(positionA, positionB) {
        return Math.max(positionA, positionB) // Math.max returns NaN from an array because assholes...
      }) + 1
    )
  }
  
  const getSectionIndex = (targetId) => {
    return selectedPost.selectedPostSections.findIndex((postSection) => {
      return parseInt(postSection.id) === parseInt(targetId)
    })
  }

  const handleChange = (event) => {
    setSelectedPost({
      ...selectedPost,
      [event.target.id]: event.target.value
    })
  }

  const handleDragOver = event => event.preventDefault();

  const handleDragStart = (event) => {
    event.dataTransfer.setData("data", event.target);
    setDragData({
      beingDraggedId: event.target.id,
      droppedPosition: null
    })
  }

  const handleDrop = (event) => {
    const oldBeingDraggedId = dragData.beingDraggedId
    setDragData({
      beingDraggedId: oldBeingDraggedId,
      droppedPosition: event.target.dataset.position
    })
    //set state from dragged to new positions
  }

  const handleInputChange = (event) => {
    setSelectedPost({
      ...selectedPost,
      [event.target.id]: parseInt(event.target.value)
    })
  }

  const handleSectionChange = (event, attribute) => {
    // attribute is 'body' or 'section_type' on Section component
    const wantedSectionIndex = getSectionIndex(event.target.id)

    let oldPostSections = selectedPost.selectedPostSections
    oldPostSections[wantedSectionIndex][attribute] = event.target.value
    setSelectedPost({
      ...selectedPost,
      postSections: oldPostSections,
    })
  }
  // 'sets up' MainPage for creating a new post
  const newPost = () => {
    setSelectedPost({
      editingPost: true,
      selectedPostTitle: '',
      postTopicId: selectedTopic.selectedTopicId || 1,
      selectedPostTags: '',
      selectedPostSections: [],
    })
    setCount(count + 1) 
  }

/* FETCH REQUEST FUNCTIONS */
  const createPost = (newPost) => {
    let tags = ''
    if (typeof newPost.postTags === "object") {
      tags = newPost.postTags.toString()
    } else {
      tags = newPost.postTags
    }

    API.post('/posts', {
      post: {
        sections: newPost.postSections,
        topic_id: parseInt(newPost.postTopicId),
        tags: tags,
        title: newPost.postTitle,
      },
    }).then((newPostData) => {
      setSelectedPost({ //set post data from new post
        editingPost: false,
        relatedPostData: newPostData.related_posts,
        selectedPostId: newPostData.post.id,
        selectedPostSections: newPostData.sections,
        selectedPostTags: newPostData.tags,
        selectedPostTitle: newPostData.post.title,
        postTopicId: newPostData.post.topic_id,
      })
    })
    reloadSidebar()
    setCount(count + 1)
  }

  const deletePost = (postId) => {
    API.deletePost(`/posts/${postId}`, postId).then((response) => {
      setSelectedPost({
        editingPost: false,
        selectedPostId: null,
        selectedPostTitle: null,
        selectedPostTags: null,
        selectedPostSections: null
      })
      reloadSidebar()
      setCount(count + 1)
    })
  }
  // Loads the navbar and its icons. Also checks to see if someone is logged in and sets that
  const getNavBarDataAndCheckLoggedIn = () => {
    API.get('/topics').then((initialLoadData) => {
      setLoggedIn(initialLoadData.loggedIn)
      setNavBarTopicData(initialLoadData.topics)
    })
  }
  // loads the sidebar and the most recent post in the sidebar,
  // which is the top post
  const getTopicData = (topicId, topicTitle) => {
    API.get(`/topics/${topicId}`).then((postData) => {
      setSelectedTopic({
        selectedTopicId: topicId,
        selectedTopicTitle: topicTitle,
        selectedTopicPosts: postData.allTopicPosts
      })
      setSelectedPost(getPostObject(postData.post))
      setCount(count + 1) 
    })
  }
  // sets all data needed for a post, recycled in any API requests 
  const getPostObject = (postData, editingBoolean = false) => {
    return {
      editingPost: editingBoolean,
      relatedPostData: postData.related_posts,
      selectedPostId: postData.post.id,
      selectedPostSections: postData.sections,
      selectedPostTags: postData.tags,
      selectedPostTitle: postData.post.title,
      postTopicId: postData.post.topic_id,
    }
  }
  // loads a post when a user clicks on one in the sidebar or
  // when the user clicks on a post in the "Related Posts" section
  const getPostData = (postId) => { 
    API.get(`/posts/${postId}`).then((postData) => {
      setSelectedPost(getPostObject(postData))
      setSelectedTopic({
        selectedTopicId: postData.post.topic_id,
        selectedTopicTitle: postData.topicTitle,
        selectedTopicPosts: postData.allTopicPosts
      })
      setCount(count + 1)
    })
  }

  const reloadSidebar = () => {
    API.get(`/topics/reload/${selectedPost.postTopicId}`).then((response) => {
      setSelectedTopic({
        selectedTopicId: response.topicId,
        selectedTopicTitle: response.topicTitle,
        selectedTopicPosts: response.allTopicPosts
      })
    })
  }

  // deletes a section within a post
  const handleSectionDelete = (sectionId, postId) => { // for deleting a section
    //This section is unpersisted, so just drop it from postSections and bail instead of submitting a DELETE request to the server
    if (sectionId.toString().match(/NEWPOST/)) {
      const filteredSections = selectedPost.selectedPostSections.filter((section) => section.id.toString() !== sectionId.toString())
      setSelectedPost({
        ...selectedPost,
        selectedPostSections: filteredSections
      })
      setCount(count + 1)
      return
    }

    API.deleteSection(`/sections/${sectionId}`, sectionId, postId).then((postData) => {
      setSelectedPost(getPostObject(postData, true))
      setCount(count + 1) 
    })
  }
  // updates section positions after clicking and dragging them around
  // Will create a new post if it is not persisted yet
  const updateSectionPositions = (postSectionData) => {
    API.put('/sections', {
      // was 'postId:' on line below
      post: { 
        postId: selectedPost.selectedPostId, 
        title: selectedPost.selectedPostTitle,
        topic_id: selectedPost.postTopicId,
        tags: selectedPost.selectedPostTags
      },
      positionData: postSectionData,
    }).then((newPostSections) => {
      setSelectedPost(getPostObject(newPostSections, true))
      setCount(count + 1) // force a rerender after dragging and dropping
    })
  }
  // updates a whole post after the Submit button is clicked
  const updatePost = (updatedPostData) => {
    let tags = ''
    if (typeof updatedPostData.postTags === "object") {
      tags = updatedPostData.postTags.toString()
    } else {
      tags = updatedPostData.postTags
    }

    API.put(`/posts/${selectedPost.selectedPostId}`, {
      post: {
        id: parseInt(selectedPost.selectedPostId),
        sections: updatedPostData.postSections,
        topic_id: parseInt(updatedPostData.postTopicId),
        tags: tags,
        title: updatedPostData.postTitle,
      },
    }).then((updatedPostData) => {
      setSelectedPost(getPostObject(updatedPostData))
      reloadSidebar()
      setCount(count + 1)
    })
  }
  // loads navbar when page loads and sees if someone is logged in
  useEffect(() => { getNavBarDataAndCheckLoggedIn() }, [])

  useEffect(() => {
    if (dragData.droppedPosition) {
      let movedPostSection = selectedPost.selectedPostSections.find((postSection) => {
        if (parseInt(postSection.id) === parseInt(dragData.beingDraggedId)) {
          return { ...postSection }
        }
      })
      // existing post sections that were not repositioned
      const postSections = selectedPost.selectedPostSections.filter((postSection) => {
        if (parseInt(postSection.id) !== parseInt(dragData.beingDraggedId)) {
          return { ...postSection }
        }
      })
      // Array.splice(index, 0, thingToAdd)
      postSections.splice(parseInt(dragData.droppedPosition) - 1, 0, movedPostSection)

      const repositionedPostSections = postSections.map((postSection, idx) => {
        return { ...postSection, position: idx + 1 }
      })

      updateSectionPositions(repositionedPostSections)
    }
  }, [dragData])

  const addPostSection = () => {
    const newSectionIdKey = new Date().getTime() + 'NEWPOST'

    const newSection = { // this object literal imitates a new Section arriving from
      id: newSectionIdKey,// the controller in an array of similar key/value pairs
      body: "",
      editingPost: true,
      section_type: 'markdown',
      position: getHighestPosition(),
      handleDragStart: handleDragStart,
      handleDragOver: handleDragOver,
      handleDrop: handleDrop,
      updateSectionPositions: updateSectionPositions,
    }

    let oldSections = selectedPost.selectedPostSections
    oldSections.push(newSection)

    setSelectedPost({
      ...selectedPost,
      selectedPostSections: oldSections
    })

    setCount(count + 1)
  }

  const startEditingPost = () => {
    setSelectedPost({...selectedPost, editingPost: true})
    setCount(count + 1)
  }

  const stopEditingPost = () => {
    setSelectedPost({...selectedPost, editingPost: false})
    setCount(count + 1)
  }

  const wipePostData = () => {
    setSelectedPost({
      editingPost: false,
      postTopicId: null,
      selectedPostId: null,
      selectedPostTitle: null,
      selectedPostTags: null,
      selectedPostSections: []
    })
    setSelectedTopic({
      selectedTopicId: null,
      selectedTopicTitle: null,
      selectedTopic: null
    })
    setShowForm(false)
    setCount(1)
  }

  return (
    <div className={styles.rootContainer}>
      <ul className={styles.navbar}>
        <Banner wipePostData={wipePostData} />

        {navBarTopicData && // the iterator 'topic' looks like [[0, 'Rails'], [1, 'sql'],...]
          navBarTopicData.map((topic) => 
            <NavBarTopic
              getTopicData={getTopicData}
              key={`topic-${topic[0]}`}
              topicId={topic[0]}
              title={topic[1]}
            />
          )
        }
        {loggedIn ? (
          <li className={styles.noDot}>
            <Button 
              className={styles.noDot}
              onClick={() => {
                API.logout().then(() => {
                  setShowForm(false)
                  setLoggedIn(false)
                })
              }}
              label="Log Out"
            />
          </li>
        ) : (
          <li className={styles.noDot}>
            <Button 
              className={styles.noDot}
              onClick={() => setShowForm(!showForm)}
              label="Log In"
            />
          </li>
        )}
        {showForm && (
          <LoginForm
            loginData={loginData}
            setLoggedIn={setLoggedIn}
            setLoginData={setLoginData}
            setShowForm={setShowForm}
          />
        )}
      </ul>

      <div key={`${count}-sidebar`} className={styles.sideBarMainContainer}>
        <SideBar
          getPostData={getPostData}
          posts={selectedTopic.selectedTopicPosts}
          title={selectedTopic.selectedTopicTitle}
        />
        {(selectedPost.selectedPostTitle || selectedTopic.selectedTopicId) ? (
          <MainPage
            addPostSection={addPostSection}
            createPost={createPost}
            draggable={selectedPost.editingPost ? "true" : null}
            editingPost={selectedPost.editingPost}
            deletePost={deletePost}
            getPostData={getPostData}
            handleChange={handleChange}
            handleSectionDelete={handleSectionDelete}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleInputChange={handleInputChange}
            handleSectionChange={handleSectionChange}
            handleSectionDelete={handleSectionDelete}
            loggedIn={loggedIn}
            navBarTopicData={navBarTopicData}
            newPost={newPost}
            relatedPostData={selectedPost.relatedPostData}
            postId={selectedPost.selectedPostId}
            postSections={selectedPost.selectedPostSections}
            postTags={selectedPost.selectedPostTags}
            postTitle={selectedPost.selectedPostTitle}
            postTopicId={selectedPost.postTopicId}
            startEditingPost={startEditingPost}
            stopEditingPost={stopEditingPost}
            updatePost={updatePost}
            updateSectionPositions={updateSectionPositions}
          />
        ) : (
          <HomePageEntry />
        )}
      </div>
    </div>
  )
}

export default Root