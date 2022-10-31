//Require dotenv
require("dotenv").config()

//Get submit element
const petSubmit = document.getElementById('pet-form')

//Submit
petSubmit.addEventListener("submit", findPets)

function findPets(e) {
  e.preventDefault()

  // Get user Input
const animal = document.getElementById('animal').value
const animalAge = document.getElementById('animal-age').value
const animalGender = document.getElementById('animal-gender').value
const zipCode = document.getElementById('zipcode').value

//Validate Zip
function zipValidation(zipCode) {
  return /^\d{5}(-\d{4})?$/.test(zipCode)
}
//Validate all inputs
if ( animal == null || animalAge == null || animalGender == null || !zipValidation(zipCode) ) {
  const divAlarm = document.createElement('div')
  const header = document.querySelector('.header')
  divAlarm.innerHTML = `<div id="alarm-message"><p class="alarm">Please check your inputs!</p><p class="alarm">Make sure that you are entering your correct American zip code.</p>`
  header.appendChild(divAlarm)
  setTimeout(()=> divAlarm.remove(), 7000)
  return
}

  let key = process.env.API_KEY
  let secret = process.env.API_SECRET
  let token;

  // get token
  fetch("https://api.petfinder.com/v2/oauth2/token", {
        method: "POST",
        body: "grant_type=client_credentials&client_id=" + key + "&client_secret=" + secret,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
    .then((res)=> res.json())
    .then((data)=> {token = data.access_token})
    .then(() => {
   // find pets
      fetch(
        `https://api.petfinder.com/v2/animals?type=${animal}&age=${animalAge}&gender=${animalGender}&location=${zipCode}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => showPets(data.animals))
    })
    .catch((err) => console.error(err))
}



// show listings of pets
function showPets(pets) {
  const found = document.querySelector('.found')

 
  found.innerHTML = ""
  found.classList.add('found', 'open-found')
  const div = document.createElement('div')
  const message = "YOUR BEST FRIEND IS WAITING FOR YOU"
  div.innerHTML = `${message}<button class="close-btn"><i class="fa fa-times-circle" aria-hidden="true"></i></button>`
  div.classList.add('found-container')
  
  // loop through pets
  pets.forEach((pet) => {
    console.log(pet)
    
    const article = document.createElement("article")
    article.classList.add('article')
    article.innerHTML = `   
    
    <div class="item1">
    <div id=""img-box>
    <img id="pet" src="${pet.photos[0] ? pet.photos[0].medium : "" }">
    </div>
        <h1>${pet.name}</h1>
        <p>${pet.breeds.primary}<p>
    </div>
    <div class="item2">
        <p class="description">${pet.description ? `<p class="description">${pet.description}</p>` : ``}
        <ul class="list">
        <li>${pet.contact.email ? `<li><strong>Email: </strong>${pet.contact.email}</li>` : ``}
        <li>${pet.contact.phone ? `<li><strong>Phone: </strong>${pet.contact.phone}</li>` : ``}
        <ul>
    </div>

      `
    div.appendChild(article)
    found.appendChild(div)
    
    //Close results
    const closeBtn = document.querySelector('.close-btn')
    closeBtn.addEventListener('click', ()=> {
      div.removeChild(article)
      found.classList.remove('found', 'open-found')
      window.location.reload()
    })
    

  })}