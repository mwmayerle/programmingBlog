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

  createNotification: function(responseStatus, type, message) {
    let container = document.getElementById('notificationContainer')
    const color = (type === "success") ? 'limegreen' : 'crimson'
    container.innerHTML = "<div style='padding-top: 0.66em;padding-bottom: 0.66em;border-left: 3px solid " + color + ";'>" + 
      "<span style='margin-left: 1em;'>" + responseStatus + ":" + "</span>" + 
      "<span style='margin-left: 1em;'>" + message + "</span>" + 
      "<span id='x' style='margin-left: 3em;margin-right: 1em;cursor: pointer;'>&times;</span>" +
    "</div>"
    document.addEventListener('click', function() { 
      document.getElementById('notificationContainer').innerHTML = ''
    })
  },

  post: async function(url, postData) {
    postData.post.sections.forEach((section) => delete section.editingPost)

    const response = await fetch(url, {
      method: 'POST',
      cache: this.cache(),
      headers: this.headers(),
      body: JSON.stringify(postData),
    });
    if (response.status === 401) {
      this.createNotification(response.status, 'failure', response.statusText)
    } else if (response.status === 200) {
      this.createNotification(response.status, 'success', 'Post created successfully')
    } else if (response.status === 422) {
      this.createNotification(response.status, 'failure', response.statusText)
    }
    return response.json()
  },
  
  deletePost: async function(url, postId) {
    const response = await fetch(url, {
      method: 'DELETE',
      cache: this.cache(),
      headers: this.headers(),
      body: JSON.stringify({ post: { id: postId } }),
    });
    if (response.status === 401) {
      this.createNotification(response.status, 'failure', response.statusText)
    } else if (response.status === 200) {
      this.createNotification(response.status, 'success', 'Post deleted')
    } else if (response.status === 422) {
      this.createNotification(response.status, 'failure', response.statusText)
    }
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
    if (response.status === 401) {
      this.createNotification(response.status, 'failure', response.statusText)
    } else if (response.status === 200) {
      this.createNotification(response.status, 'success', 'Section deleted')
    } else if (response.status === 422) {
      this.createNotification(response.status, 'failure', response.statusText)
    }
    return response.json();
  },

  get: async function(url) {
    const response = await fetch(url, {
      method: 'GET',
      cache: this.cache(),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 422) {
      this.createNotification(response.status, 'failure', response.statusText)
    }
    return response.json()
  },

  login: async function(loginData) {
    const response = await fetch('/sign_in', {
      method: 'POST',
      cache: this.cache(),
      headers: this.headers(),
      body: JSON.stringify(loginData)
    })
    if (response.status === 401) {
      this.createNotification(response.status, 'failure', response.statusText)
    } else if (response.status === 200){
      this.createNotification(response.status, 'success', 'Logged in successfully')
    } else if (response.status === 422) {
      this.createNotification(response.status, 'failure', response.statusText)
    }
    return response.json();
  },

  logout: async function() {
    const response = await fetch('/sign_out', {
      method: 'DELETE',
      cache: this.cache(),
      headers: this.headers()
    })
    if (response.status === 200){
      this.createNotification(response.status, 'success', 'You have been logged out')
    } else if (response.status === 422) {
      this.createNotification(response.status, 'failure', response.statusText)
    }
    return response.status;
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
    if (response.status === 401) {
      this.createNotification(response.status, 'failure', response.statusText)
    } else if (response.status === 200 || response.status === 204){
      this.createNotification(response.status, 'success', 'Post updated successfully')
    } else if (response.status === 422) {
      this.createNotification(response.status, 'failure', response.statusText)
    }
    return response.json();
  }
}