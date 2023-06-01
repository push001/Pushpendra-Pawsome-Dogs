let buttonEl = document.getElementById("get-dog-btn");
let loaderOverlayEl = document.querySelector(".loader-overlay");


function showLoader() {
    loaderOverlayEl.style.display = "block";
}

function hideLoader() {
    loaderOverlayEl.style.display = "none";
}

function addImageToPage(category="random"){
    showLoader();
    let imgEl = document.getElementById("dog-image");
    let url = "";
    if(category === "random")
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
            hideLoader();
            
        });
}


addImageToPage();
buttonEl.addEventListener("click", function(){
    let dropdownEl = document.getElementById("breed-dropdown");
    let dropdownValue = dropdownEl.value;
    addImageToPage(dropdownValue);
});