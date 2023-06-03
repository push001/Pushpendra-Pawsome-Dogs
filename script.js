import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

let appSettings = {
    databaseURL: "https://playground-f3102-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const dogsInDB = ref(database, "favorite-dogs");

let buttonEl = document.getElementById("get-dog-btn");
let removeFavoriteBtnEl = document.getElementById("removeBtn");
let addFavoriteBtnEl= document.getElementById("likeBtn");
let loaderOverlayEl = document.querySelector(".loader-overlay");
let imgEl = document.getElementById("dog-image");

let favoriteDogUrl = "";
let favoriteDogId = "";
let  favoriteDogsArray = [];


$('#likeBtn').click(function(){

    $('#sucessAlert').removeClass('d-none');
    $('#sucessAlert').show();
    setTimeout(() => {
      $('#sucessAlert').hide();
    }, 1500);
    
})

$('#removeBtn').click(function(){

    $('#dangerAlert').removeClass('d-none');
    $('#dangerAlert').show();
        
    setTimeout(() => {
        $('#dangerAlert').hide();
    }, 1500);
    
})

function showLoader() {
    loaderOverlayEl.style.display = "block";
}

function hideLoader() {
    loaderOverlayEl.style.display = "none";
}

function showImageBtn(btnElement){
    btnElement.style.visibility = "visible";
}

function hideImageBtn(btnElement){
    btnElement.style.visibility = "hidden";
}
function addImageToFavoriteList(imageUrl){
    push(dogsInDB, imageUrl);
}

function addImageToPage(category="random"){
    showLoader();
    let url = "";
    if(category === "random" || category ==="favourite") 
    {
        url = "https://dog.ceo/api/breeds/image/random";
    }
    else{
        url = `https://dog.ceo/api/breed/${category}/images/random`;
    }
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            imgEl.src = data.message;
            favoriteDogUrl = data.message;
            hideLoader();
            
        });
}



let dropdownEl = document.getElementById("breed-dropdown");

window.addEventListener("load", showImageBasedOnDropDownValue);

function capitalize(word){
    let capitalizedWord =  word.charAt(0).toUpperCase() + word.slice(1);
    return capitalizedWord;
}
function changeButtonValueAsPerDropDownValue(){
    let dropdownValue = dropdownEl.value;
    buttonEl.textContent = `Get Another ${capitalize(dropdownValue)} Dog`;
}

function loadRandomDogFromFavoriteList() {
    // Fetch all the favorite dogs from the database
    showLoader();
    onValue(dogsInDB, function(snapshot){
        
      if (snapshot.exists()){
        const favoriteDogs = snapshot.val();

        // Convert the favorite dogs object to an array where each item is pair of id and url
        favoriteDogsArray = Object.entries(favoriteDogs);

        // Generate a random index
        const randomIndex = Math.floor(Math.random() * favoriteDogsArray.length);

        // Get the random dog URL
        const randomDogUrl = favoriteDogsArray[randomIndex][1];
        favoriteDogId = favoriteDogsArray[randomIndex][0];
        console.log(favoriteDogId);
        console.log(favoriteDogsArray);

        // Display the random dog URL
        imgEl.src = randomDogUrl;
      }

      else{
        imgEl.src = "./assets/empty_FavoriteListImage.png";
        hideImageBtn(addFavoriteBtnEl);
        hideImageBtn(removeFavoriteBtnEl);
      }
      
    });

    hideLoader();
  }

function showImageBasedOnDropDownValue(){
    let dropdownValue = dropdownEl.value;
    if(dropdownValue === "favourite"){
        showImageBtn(removeFavoriteBtnEl);
        hideImageBtn(addFavoriteBtnEl);
        loadRandomDogFromFavoriteList();
    }
    else{
        showImageBtn(addFavoriteBtnEl);
        hideImageBtn(removeFavoriteBtnEl);
        addImageToPage(dropdownValue);
        $('#sucessAlert').addClass('d-none');
    }
    changeButtonValueAsPerDropDownValue();
}

buttonEl.addEventListener("click", function(){
    let dropdownValue = dropdownEl.value;
    if(dropdownValue === "favourite"){
        
        loadRandomDogFromFavoriteList();
    }
    else{
        addImageToPage(dropdownValue);
        $('#sucessAlert').addClass('d-none');
        hideImageBtn(removeFavoriteBtnEl);
        showImageBtn(addFavoriteBtnEl);
        
    }
    changeButtonValueAsPerDropDownValue();
});

dropdownEl.addEventListener("change", showImageBasedOnDropDownValue);

removeFavoriteBtnEl.addEventListener("click", function(){
    let exactLocationOfItemInDB = ref(database, `favorite-dogs/${favoriteDogId}`);
    remove(exactLocationOfItemInDB);

    let dropdownValue = dropdownEl.value;

    if(dropdownValue === "favourite")
    {
        loadRandomDogFromFavoriteList()
    }
    else{
        hideImageBtn(removeFavoriteBtnEl);
        showImageBtn(addFavoriteBtnEl);
    }
    

})

addFavoriteBtnEl.addEventListener("click", function(){
    hideImageBtn(addFavoriteBtnEl);
    $('#dangerAlert').addClass('d-none');
    push(dogsInDB, favoriteDogUrl);
    showImageBtn(removeFavoriteBtnEl);
})