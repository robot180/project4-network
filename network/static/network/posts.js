document.addEventListener('DOMContentLoaded', function() {
    // Use buttons to toggle between views
    // document.querySelector('#newPost-button').addEventListener('click', () => load_posts());

    // document.querySelector('#like-unlike').addEventListener('click', () => like());
    // By default, load the inbox
    // document.querySelector('#newPost-form').style.display = 'none';

  });
  //from project3 load_mailbox()

// function load_posts() {

//   // Show the allPosts div in index.html...unncessary?
//   document.querySelector('#allPosts').style.display = 'block';
//   // fetch all posts but display only 10 per page. See Pagination specification
//   fetch(`/allPosts/`)
//   //fetch the JsonResponse from Django API route allPosts which will. The JsonResponse is a queryset of Post objects aka a list of all the posts
//   //make the data in the JsonResponse accessible via first then + response.json()
//   //the returned JSON data is a promise object which we can call allposts
//   .then(response => {
//     //console.log(response);
//     return response.json();
//   })
//   .then(allposts => {
//         console.log(`data after first .then():`)
//         console.log(allposts);  //check how does the data from Django JsonResponse look like after it has been throug the first .then()
//         //allposts is a JS array. 1st element = the authenticated dict and 2nd element = Django post queryset (which looks like a another array)
//         //take out the first element of all posts using shift leaving only the 2nd element. so now allposts is a an array with one element which is also an array
//         authenticated = allposts.shift();
//         console.log(`can see the 1st element, a JSON obj, no longer part of prior data:`)
//         console.log(authenticated)
//         console.log(`data after first element was removed, should be an array in an array:`)
//         console.log(allposts)
//         console.log(allposts.has_previous)
//         //data can be accessed but it's tedious
//         //console.log(allposts[0][1].fields.body)
//         allposts = allposts.shift();
//         //the queryset should now be accessible with ease just like the email project
//         console.log(`data after 2nd element was removed, should just be an array now:`)
//         console.log(allposts)
//         //if there are no posts, show a message otherwise for each post, call the populate function and pass in that post as the paraameter
//         if (allposts.length === 0) {
//             const noposts = document.createElement('div');
//             noposts.innerHTML = "There are no posts.";
//             document.querySelector('#allPosts').append(noposts);
//         }
//         else {
//             //for each JSON object, call populate_allPosts_div and pass in that object & the user_id as parameters (if not logged in user_id= JS null value)
//             allposts.forEach(element => populate_allPosts_div(element, authenticated.user))
            
      
//         }
//   })
// };



// function populate_allPosts_div(contents, user_id) {
//     const single_post = document.createElement('div');
//     single_post.className = 'post_div row justify-contents-between pointer-link p-2';
//     var utcDate = contents.fields.timestamp;
//     var localDate = new Date(utcDate).toLocaleString("en-US",);
//     //console.log(localDate);
//     single_post.innerHTML = `
//     <div class="col-6 col-sm-5 col-md-3 p-2 order-md-2 small text-right text-muted font-italic font-weight-lighter align-self-center">Received On: ${localDate}</div>
//     <div class="col px-2 pb-2 pt-md-2 order-md-1 text-truncate">${contents.fields.title}
//     <small><em>From:${contents.fields.body}<em></small></div>`;
//     //single_post.id = `single_post-${contents.id}`; only stores the single_post object id. not used since single_post.data = contents can store the entire single_post object
//     // single_post.data = contents;
//     //create a Like button and add it to the single_post div if user is logged in
//     single_post.data = contents.fields.liked_by
//     //the Like/Unlike button will only appear if the user is logged in
//     // if (single_post.data.includes(user_id)){
//     //     //console.log("true")
//     //     const unlike_button = document.createElement('button');
//     //     unlike_button.setAttribute('id', 'unlike');
//     //     unlike_button.innerHTML = "Unlike";
//     //     unlike_button.className= "col-2 col-sm-1 col-md-2 p-2 order-md-2 text-center align-self-center"
//     //     unlike_button.data = contents;
//     //     single_post.append(unlike_button);}
//     // else
//     //     {console.log("false")};
    
//     const like_button = document.createElement('button');
//     like_button.setAttribute('id', 'like-unlike');
//     like_button.className= "col-2 col-sm-1 col-md-2 p-2 order-md-2 text-center align-self-center"
//     //data = contents.liked_by required bc it will be accessed by the API when like button is clicked
//     like_button.data = contents.liked_by
//     single_post.data.includes(user_id) ? like_button.innerHTML = "Unlike": like_button.innerHTML = "Like"
//     single_post.append(like_button);
//     document.querySelector('#allPosts').append(single_post);


// }

async function likepost(post) {
  console.log(post.likedpostId);
  console.log(typeof(post.likedpostId));
  console.log(post.user);
  await fetch(`/edit/${post.likedpostId}`, {
    method: 'PUT',
    body: JSON.stringify({
      user: post.user
    })
  })
  .then(response => response.json())
  .then(result => {
    // console.log(result);
    newlike_count = result.newlike_count
    // console.log(newlike_count);
  });
  // likes = parseInt(post.likedpostId)
  const like_button = document.getElementById(`post${post.likedpostId}-like-unlike`)
  // like_button.innerText == "Like" ? document.getElementById(`post${post.likedpostId}-likes`).innerHTML = `Likes: ${likes + 1}`: document.getElementById(`post${post.likedpostId}-likes`).innerHTML = `Likes: ${likes - 1}`
  like_button.innerText == "Like" ? document.getElementById(`post${post.likedpostId}-likes`).innerHTML = `Likes: ${newlike_count}`: document.getElementById(`post${post.likedpostId}-likes`).innerHTML = `Likes: ${newlike_count}`
  like_button.innerText == "Like" ? like_button.innerText = "Unlike": like_button.innerText = "Like";
  

  // .then(response => response.json())
  // .then(result => {

  //     console.log(result);
  //     updated_post = result[0].fields;
  //     var utcDate = updated_post.timestamp;
  //     var localDate = new Date(utcDate).toLocaleString("en-US",);

  //     updated_postdiv = document.getElementById(`post${result[0].pk}`)
  //     updated_postdiv.innerHTML = `
  //     <div class="col-6 col-sm-5 col-md-3 p-2 order-md-2 small text-right text-muted font-italic font-weight-lighter align-self-center">Posted On: ${localDate}</div>
  //     <div class="col px-2 pb-2 pt-md-2 order-md-1 text-truncate">${updated_post.title}
  //     <small><em>${updated_post.body}<em></small></div>`;
  // });  
  //   // load_updated_post(post_id)
    return false;

}; 



//use React state. store the value of the post in the state. allow user to up date state so that it display changes 
//without reload AND use fetch API to update the model instance


function editpost(content) {
  console.log(content.editpostbody);
  console.log(content.editpostId);
  console.log(content)
  //after clicking edit, create a textarea box and propagate the original post
  const editbox = document.createElement("textarea");
  editbox.maxLength = 450;
  // editbox.name = updatedpost;
  editbox.setAttribute("id", "editbox")
  editbox.classList="post_div row justify-contents-between pointer-link p-2 form-control"
  const t = document.createTextNode(`${content.editpostbody}`)
  editbox.appendChild(t);
  //clear all the content of postdiv and insert the textarea box so that user can edit the post
  document.getElementById(`post${content.editpostId}`).innerHTML = ""
  document.querySelector(`#post${content.editpostId}`).appendChild(editbox)
  const submit_button = document.createElement("button");
  submit_button.setAttribute("id", "submit_button");
  submit_button.className = "btn green-button"
  submit_button.innerHTML = "Submit Edits";
  // submit_button.addEventListener("click", submit_edits())
  document.querySelector(`#post${content.editpostId}`).appendChild(submit_button);
   //access the submit_edits function when clicked
  link = `"{% url 'profileurl' username_profile=${content.editpostId} %}"`
  submit_button.addEventListener("click", () => {submit_edits(content, editbox.value, link)}) 
};



async function submit_edits(content, editedpost, link) {
  console.log(content)
  console.log(content.postauthor)
  await fetch(`/edit/${content.editpostId}`, {
  method: 'PUT',
  body: JSON.stringify({
    editedpost: editedpost
  })
  
})
.then(function(response) {
//handle if fetch returns a 404 status https://stackoverflow.com/questions/39297345/fetch-resolves-even-if-404
  if(!response.ok) {
    alert("Post character limit is 450");
    throw new Error("404 resposne received");
} else {response.json()
.then(result => {
    // Print result
    //results look slightly different than the load_mailbox function in project3
    // because project4 submit_edits view had serialize() whereas
    //project3 serialization was manually done in the model.py?
    console.log(result);
    updated_post = result[0].fields;
    var utcDate = updated_post.timestamp;
    var localDate = new Date(utcDate).toLocaleString("en-US",);
    //clear the textarea and "submit edits" button from the postdiv (this is the same div when the index html was first generated by the index view)
    //cannot access the post id by the var name, id, because the results showed var name as pk. It's the same thing just different names
    updated_postdiv = document.getElementById(`post${result[0].pk}`)
    updated_postdiv.innerHTML = `
    <div class="col-6 col-sm-5 col-md-3 p-2 order-md-2 small text-right text-muted font-italic font-weight-lighter align-self-center">Posted On: ${localDate}
    by <a href="${link}">${content.postauthor}</a></div>
    <div class="col px-2 pb-2 pt-md-2 order-md-1 text-truncate">${updated_post.title}
    <small><em>${updated_post.body}</em></small></div>
    <div class="col-2 col-sm-1 col-md-1 p-2 order-md-2 text-right font-italic align-self-center"><strong>Likes: ${updated_post.liked_by.length}</strong></div>
    `;
    //can create the edit button by including the following in the above innerHTML:
    //<button id="#editpost" class="col-2 col-sm-1 col-md-2 p-2 order-md-2 text-center align-self-center" data-editpostbody="${updated_post.body}" data-editpost-id="${post_id}" onclick="editpost(this.dataset)">Edit Post</button>
    //or recreate the "edit post" button using createElement
    const editbutton = document.createElement('button');
    editbutton.setAttribute("id", `post${result[0].pk}editpost`);
    editbutton.classList = "btn green-button col-2 col-sm-1 col-md-2 p-2 order-md-2 text-center align-self-center";
    editbutton.innerHTML = "Edit Post";
    editbutton.dataset.editpostbody = updated_post.body;
    editbutton.dataset.editpostId = content.editpostId;
    editbutton.dataset.postauthor = content.postauthor;
    editbutton.dataset.link = `"{% url 'profileurl' username_profile=${content.editpostId} %}"`
    editbutton.addEventListener("click", () => {editpost(editbutton.dataset)}) 
    document.getElementById(`post${content.editpostId}`).appendChild(editbutton);
    
    // <button id="#editpost" class="col-2 col-sm-1 col-md-2 p-2 order-md-2 text-center align-self-center" data-editpostbody="{{ updated_post.body }}" onclick="editpost(this.dataset)">Edit Post</button>

});  }})
  return false;

}; 


async function follow(data) {
  console.log(data.selected_user);
  await fetch(`/follow`, {
    method: 'PUT',
    body: JSON.stringify({
      selected_user: data.selected_user
    })
  })
  .then(response => response.json())  
  .then(accessible_data=> {
    // console.log(accessible_data)
    newfollowersCount = accessible_data.newfollowersCount
    // console.log(newfollowersCount)
  })
  document.getElementById("followers").innerText = `Followers: ${newfollowersCount}`;
  // console.log(document.getElementById("follow-button").innerText)
  follow_button = document.getElementById("follow-button")
  follow_button.innerHTML == "Follow" ? follow_button.innerHTML = "Unfollow" : follow_button.innerHTML = "Follow";
  };
 
  