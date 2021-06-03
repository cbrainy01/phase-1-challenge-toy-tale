let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

 //make get request to fetch toy objects
  fetch("http://localhost:3000/toys")
  .then(  (response) => {return response.json();}  )
  .then(  (responseData) => {
    console.log(responseData);
    //for each toy object in responseData, create a new div with class of 'card' and append to the div with id of 'toy-collection'.
    responseData.forEach(element => {
      //function does all the creating and appending 
      addToDOM(element);
          
    });  
  
  })

  function addToDOM(element)  {
    //create div for each toy and set its class to "card"
      const toyDiv = document.createElement("div");
      toyDiv.className = "card";
      //create h2, img, p, delete button, and likebutton tags
      const nameTag = document.createElement("h2");
      const imageTag = document.createElement("img");
      const likeCount = document.createElement("p");
      const buttonTag = document.createElement("button");
      const deleteButton = document.createElement("button");
      //set innertext of delete button
      deleteButton.innerText = "delete";
      //set id of delete button
      deleteButton.id = element.id;
      //put name of toy in paragraph
      nameTag.textContent = element.name;
      //add link to image via setAttribute and set class to "toy-avatar"
      imageTag.setAttribute("src", element.image);
      imageTag.setAttribute("class", "toy-avatar");
      //set likeCount
      likeCount.textContent = element.likes;
      //set class and id for button
      buttonTag.setAttribute("class", "like-btn");
      buttonTag.id = element.id;
      buttonTag.textContent = "Like <3";
      //create element for the collection div
      const collectionDiv = document.querySelector("#toy-collection");
      collectionDiv.appendChild(toyDiv);
      //append h2, img, p, and button to the toyDiv
      toyDiv.appendChild(nameTag);
      toyDiv.appendChild(imageTag);
      toyDiv.appendChild(likeCount);
      toyDiv.appendChild(buttonTag);
      toyDiv.appendChild(deleteButton);
      //add event listener for delete button
      deleteButton.addEventListener("click", removeToy);
      //add event listener for like button
      buttonTag.addEventListener("click", upLikes);
     
    }

     function removeToy(event) {
       const configObj = {
         method: "DELETE", 
         headers: {"Content-Type": "application/json"},
       };
        //create fetch request with method of DELETE
        fetch(`http://localhost:3000/toys/${event.target.id}`, configObj)
        .then(response => response.json())
        .then(  (responseData) => {
        //remove that elements div in the DOM
        event.target.parentElement.remove();
        }  )
      .catch(error => console.log(error));

     }

     function upLikes(event) {
        //when clicked the like count goes up by one
        const likesStr = event.target.previousElementSibling;
        let numOfLikes = parseInt(likesStr.innerText, 10);
        const bodyData = {
          //update likes in server
          "likes": numOfLikes += 1
          }
          const patchObj = {
           method: "PATCH",  
           headers: {"Content-Type": "application/json", 
            Accept: "application/json"},
            body: JSON.stringify(bodyData)
          
          }
          //update likes in DOM
           likesStr.innerText = numOfLikes;
          //create patch request. Using id of whatever button was clicked in order to acess the right directory for the object
          //patchObj contains the object which contains what is going to be changed
          fetch(`http://localhost:3000/toys/${event.target.id}`, patchObj)
      }

  //////////////////////////////////////////////////////////////////////////////////////////
  //create submit event for 'create toy' button
  const createToyForm = document.querySelector(".add-toy-form");
  //add event listener which sends a post request to server
  createToyForm.addEventListener("submit", postToy);
  function postToy(event) {
    event.preventDefault();
    const nameInput = document.querySelector(".add-toy-form :nth-child(2)").value;
    const imageInput = document.querySelector(".add-toy-form :nth-child(4)").value;
    let likeCount = 0;
    const bodyData = {
    //get value of what user into the form fields and store into name and image keys
   "name": nameInput,
   "image": imageInput,
   "likes": likeCount,
    }
    const configurationObj = {
      method: "POST",
      headers: {"Content-Type": "application/json", 
      Accept: "application/json" }, 
      body: JSON.stringify(bodyData)
    }
    //sends data to update server
    fetch("http://localhost:3000/toys", configurationObj)
    .then( (response) => {return response.json();} )
    .then((responseData) => {
      //update DOM based on server updates
      addToDOM(responseData);
      
    })
    }  
////////////////////////////////////////////////////////////////////////////////////////////


});
