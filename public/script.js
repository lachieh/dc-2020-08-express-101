/// CLIENT SIDE SCRIPT

// function to convert friends array data to an html string
function renderFriends(friendsArray) {
  // map over each friend object in the friends array
  const friendsHtml = friendsArray.map(friend => {
    // return a string of HTML for each friend into the friendsHtml array
    return `
      <li>
        ${friend.name} (${friend.handle})
        <button onclick="deleteFriend('${friend.handle}')">x</button>
      </li>
    `
  })
  
  // because friendsHtml is an array (maps return arrays), we need to make it
  // one big long string, so we join it with an empty string
  return friendsHtml.join('')
}

// function to fetch and update friends on the page
function updateFriends() {
  // get the friends data from the server
  axios.get('/api/friends')
    // then, once the response comes back from the API
    .then(res => {
      // find the friends list in the DOM
      const friendsUl = document.getElementById('friends');
      // update the HTML inside the list using the friends data from the server
      friendsUl.innerHTML = renderFriends(res.data)
    })

  // this fetch is the same code as the above but uses fetch instead of axios
  // fetch('/api/friends')
  //   .then(res => res.json())
  //   .then(data => {
  //      const friendsUl = document.getElementById('friends');
  //      friendsUl.innerHTML = renderFriends(res.data)
  //   })

}

// function to handle deleting 
function deleteFriend(handle) {
  // use axios to send a DELETE request to the server
  axios.delete(`/api/friends/${handle}`)
    // then once the server responds
    .finally(res => {
      // use the update friends function to refresh the page with latest data
      updateFriends();
    })
}

// ==== script actions

// find the form on the page
const form = document.getElementById('friendForm')

// add a submit listener to the form
form.addEventListener('submit', (e) => {

  // prevent default behavior of the form
  e.preventDefault()

  // send a POST request to the server and get all the data from the form fields
  axios.post('/api/friends', {
    name: e.target.elements.name.value,
    handle: e.target.elements.handle.value,
    skill: e.target.elements.skill.value
  })
    // then once the server responds
    .then(res => {
      // refresh the friends list on the page
      updateFriends();
      // reset the form fields
      form.reset();
    })
    // if there are any errors, show the user an error
    .catch(err => {
      alert('Something went wrong. Please check your fields and try again.')
    })
})

// finally, go and fetch the friends list for the first time and display them
updateFriends()