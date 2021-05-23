import React, { useEffect, useState } from 'react';

import { API } from '../utilities/api.js';
import MainPage from './MainPage';
import NavBarTopic from './NavBarTopic';
import styles from './Root.module.scss';
// import ReactDOM from 'react-dom';

const Root = (props) => {
  const [loggedIn, setLoggedIn] = useState(false)
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

  const handleLogInChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.id]: event.target.value
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
  // Loads the navbar and its icons
  const getNavBarData = () => {
    API.get('/topics').then((topicData) => {
      setNavBarTopicData(topicData)
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
  const updateSectionPositions = (postSectionData) => {
    API.put('/sections', {
      // was 'postId:' on line below
      post: { postId: selectedPost.selectedPostId },
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

  useEffect(() => {
    getNavBarData() //loads navbar when page loads
  }, [])

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

  /* RENDERING COMPONENT FUNCTIONS */ 
  const renderMainPage = () => {
    if (selectedPost.selectedPostTitle || selectedTopic.selectedTopicId) {
      return (
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
      )
    } else {
      return (
        <div style={{display:'block', marginLeft: '4em', marginRight: '16em'}}>
          <br />
          <h1>What is this thing I have found?</h1>
          <div>
            <p>
            <i style={{backgroundColor: "#142026"}}>
              <span className={styles.red}>this</span><span className={styles.teal}>.</span><span className={styles.blue}>killMe</span><span className={styles.teal}>(); </span>
            </i>
              &nbsp; is my own personal blog/learning tool that I wrote to help me not be bad at my job and continue to learn. It summarizes various books/videos without citing them. 
              As an added bonus I have no academic computer science background. It is clearly a wealth of highly trusted information that you should blindly believe at face value without question.
            </p>
          </div>
          <div>
            <h2>Why didn't you use a blog template?</h2>
            <div>
              <p>
                I learn best when I write things down. Unfortunately, coding is a pretty shit topic in the "write on a piece of paper"-style of notetaking I prefer. 
                I wanted to write and then have what I have written autoformatted so that I'm not dicking around with divs and spans forever. Unfortunately, as you can probably tell from looking at this homepage,
                styling and design are not my strong points. Additionally, when you import everything for your project despite the imports usually being superior and tested, you don't learn nearly as much.
                I believe there is an over-emphasis on creating unique side-projects because it still takes skill to figure out a way to clone an existing application and achieve similar functionality,
                and this blog managed to do what all generic blogs do (love writing sentences that are a complete lie like that, I've only seen maybe 4) but better. Without lying I can say that my code-formatter
                does a better job than Gitlab's code formatter, although Gitlab's is probably far less of a bloated whore.
              </p>
            </div>
          </div>
          <div>
            <h2>So how does this work?</h2>
            <p>
              The whole blog has a Topic model, which is what is in the navbar at the top, and each topic has an associated Post model, 
              which appears in the navbar on the left if you were to click on a topic and said topic actually has posts. 
              Each post is composed of Sections, which have a position integer attribute, body string, a type, and other irrelevant crap you don't care about. Sections in each post are sorted numerically.
              When post is selected and the page loads, the Post's body string is run through a gauntlet of regular expressions. The regex has a hierarchy of matches and uses whatever the first
              match that it finds is. For example, something like "44 years ago" (pretend that's a literal string and not me quoting something) will have finding a string above finding a random number in the hierarchy.
              When a match is found, it is removed from the original string, gets spitroasted by some span tags with a color class, and then shoveled into an array of "formatted text".
              This process continues until the original string is empty or a safety counter I added hits 10000. The formatted strings are then thrown into a div and designed to look like
              like an extension or whatever for VS Code I downloaded called "Boxy Ocean (dimmed bg)". 
              There are also Tags, which are used to dump any posts that have the same tag regardless of topic in the links at the bottom of the page.
            </p>
            <p>
              Unless you're on the homepage (which is this page), everything you see will be a Post consisting of Sections.
            </p>
          </div>
          <div>
            <h2>So what can it actually do?</h2>
            <p>
              All posts you see will have sections that default to what I call "imitation markdown". The imitation markdown does all of the basic formatting you expect, and it can create hyperlinks.
              It doesn't do image uploads or anything, but this is free-tier trash I'm using so that shouldn't be surprising. The markdown algorithm is recursive for zero benefit and I don't know
              why I did that.
            </p>
            <p>
              This block will auto-format several types of codeblock. They <i>mostly</i> will end up looking correct, but there are exceptions. They look very similar to what you would see in VS Code
              with the "Boxy Ocean (dimmed bg)" theme I blatantly ripped off. This blog will format but not run code blocks of the following:
            </p>
            <p>
              - Ruby
              <br />
              - Javascript
              <br />
              - JSX and HTML (really)
              <br />
              - Postgresql
              <br />
              - CSS
              <br />
              - Markdown
            </p>
            <p>
              And again, I can say with confidence the end result is better than what Gitlab's code review section can do in the formatting department, although Gitlab has an order or two of magnitude more features.
              You can also click and drag post sections to reorder them, and they can be edited/deleted individually for the inevitable typo, omission of a critical word, or other mistakes that I am prone to making while writing.
            </p>
          </div>
          <div>
            <h2>What can it not do?</h2>
            <p>
              So I was going to add support for images, but then I decided uploading images into the asset pipeline, AWS, ActiveStorage, etc would be even more
              overkill than this entire blog is from the get go, and from what I've read storing a blob as a string in the database is very not recommended.
              Perhaps this will be revisited in the future.
            </p>
          </div>
          <div>
            <h2>What are your plans for this?</h2>
            <p>
              To write something every weekday that isn't Friday and once on the weekend (lol that'll totally happen). Unfortunately now that this is mostly complete I cannot put off doing real work :(
            </p>
            <br />
            <p>
              Thanks for stopping by,
              <br />
              Matt
            </p>
          </div>
        </div>
      )
    }
  }

  const renderNavBar = () => {
    return (
      <ul className={styles.navbar}>
        <div 
          className={styles.banner}
          // Reset almost everything and go to the homepage
          onClick={() => {
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
          }}
          >
          <i>
            <span className={styles.red}>this</span>
            <span className={styles.teal}>.</span>
            <span className={styles.blue}>killMe</span>
            <span className={styles.teal}>();</span>
          </i>
        </div>
        {navBarTopicData && (
          // the iterator 'topic' looks like [[0, 'Rails'], [1, 'sql'],...]
          navBarTopicData.map((topic) => 
            <NavBarTopic
              getTopicData={getTopicData}
              key={`topic-${topic[0]}`}
              topicId={topic[0]}
              title={topic[1]}
            />
          )
        )}
        {loggedIn ? (
          <li className={styles.noDot}>
            <button onClick={() => {
              API.logout().then(() => {
                setShowForm(false)
                setLoggedIn(false)
              })
            }}>
              Log Out
            </button>
          </li>
        ) : (
          <li className={styles.noDot}>
            <button onClick={() => setShowForm(!showForm)}>
              Log In
            </button>
          </li>
        )}
        {showForm && (
          <form>
            <label htmlFor='email'>Email:</label>
            <input
              className={styles.loginInput}
              id='email'
              type='email'
              name='email'
              onChange={event => handleLogInChange(event) }
            >
            </input>
            <label htmlFor='password' className={styles.labelMargin}>Password:</label>
            <input 
              className={styles.loginInput}
              id='password'
              type='password'
              name='password'
              onChange={event => handleLogInChange(event) }
            >
            </input>
            <button onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              API.login(loginData).then((response) => {
                setLoggedIn(response.loggedIn)
                setLoginData( { email: null, password: null } )
                setShowForm(false)
              })
            }}>
              Plz no log in
            </button>
          </form>
        )}
      </ul>
    )
  }

  const renderSideBar = () => {
    return (
      <div className={styles.sideBarContainer}>
        {selectedTopic.selectedTopicTitle && (
          <div className={styles.sideBarTitle}>
            <p>{selectedTopic.selectedTopicTitle}</p>
          </div>
        )}
        {selectedTopic.selectedTopicPosts && (
          // Make this a link generating component
          selectedTopic.selectedTopicPosts.map((post, index) => {
            return (
              <button
                className={styles.sideBarLink}
                key={index}
                onClick={getPostData.bind(null, post.id)}
              >
                {post.title}
              </button>
            )
          })
        )}
      </div>
    )
  }

  return (
    <div className={styles.rootContainer}>
      {renderNavBar()}
      <div key={count} className={styles.sideBarMainContainer}>
        {renderSideBar()}
        {renderMainPage()}
      </div>
    </div>
  )
}

export default Root