export const API = {
  cache: function() {
    return 'no-cache'
  },

  csrfToken: function() {
    return document.querySelector("[name='csrf-token']").content
  },

  headers: function() {
    return {
      'Content-Type': 'application/json',
      'X-CSRF-Token': this.csrfToken()
    }
  },

  post: async function(url, postData) {
    postData.post.sections.forEach((section) => {
      delete section.editingPost
    })

    const response = await fetch(url, {
      method: 'POST',
      cache: this.cache(),
      headers: this.headers(),
      body: JSON.stringify(postData),
    });
    return response.json();
  },
  
  deletePost: async function(url, postId) {
    const response = await fetch(url, {
      method: 'DELETE',
      cache: this.cache(),
      headers: this.headers(),
      body: JSON.stringify({ post: { id: postId } }),
    });
    return response.json();
  },

  deleteSection: async function(url, sectionId, postId) {
    const response = await fetch(url, {
      method: 'DELETE',
      cache: this.cache(),
      headers: this.headers(),
      body: JSON.stringify({ 
        post: { postId: postId },
        section: { id: sectionId }
       }),
    });
    return response.json();
  },

  get: async function(url) {
    const response = await fetch(url, {
      method: 'GET',
      cache: this.cache(),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.json()
  },

  put: async function(url, postData) {
    if (postData.positionData) {
      postData.positionData.forEach((section) => {
        delete section.created_at
        delete section.editingPost
        delete section.post_id
        delete section.updated_at
      })
    }
    if (postData.post.sections) { // this isn't present when updating positions
      postData.post.sections.forEach((section) => {
        delete section.editingPost
      })
    }

    const response = await fetch(url, {
      method: 'PUT',
      cache: this.cache(),
      headers: this.headers(),
      body: JSON.stringify(postData),
    });
    return response.json();
  }
}