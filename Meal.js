const inputvalue=document.getElementById("input");
const searchresults=document.getElementById("search-results");
const myFavoriteMeals= document.getElementById("favourite-btn");

let favouriteArray = []; // Array to store favorite meal IDs
let URL; // URL for API requests

//check array is present in local storage or not
if (!localStorage.getItem("favouriteArray")) {
    localStorage.setItem("favouriteArray", JSON.stringify(favouriteArray));
  } else {
    favouriteArray = JSON.parse(localStorage.getItem("favouriteArray"));
  }

// Function to fetch and display more details about a meal
async function moreDetails(){
    let id = this.id;
    
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
   //console.log(data); 
    searchresults.innerHTML='';

    let meals = data.meals[0];

    const div = document.createElement('div');
    div.classList.add('details-page');
    div.innerHTML = `
      <img src="${meals.strMealThumb}" alt="">
      <h3>${meals.strMeal}</h3>
      <p>${meals.strInstructions}</p>
      <h5>Cuisine Type: ${meals.strArea}</h5>
      <a href="${meals.strYoutube}"><button type="button" class='border-circle more-details' id='${meals.idMeal}'>Watch Video</button></a>`;
  
    searchresults.append(div);
}

function toggleFavorites(event) {
    console.log(event);
    event.preventDefault();
    let index = favouriteArray.indexOf(this.id);
    if (index == -1) {
      favouriteArray.push(this.id);
      this.classList.add('clicked');
    } else {
      favouriteArray.splice(index, 1);
      this.classList.remove('clicked');
    }
  
    localStorage.setItem("favouriteArray", JSON.stringify(favouriteArray));
  }

//this function fetch the url and gets the results
async function createMeals(URL){
      const response= await fetch(URL);
      const result = await response.json();
      //console.log("result:", result);
      searchresults.innerHTML='';

      for(let meals of result.meals){
          const itemdiv=document.createElement("div"); //creating new div for the item to render on the screen 
          itemdiv.classList.add("items");
          itemdiv.innerHTML=`
          <img src="${meals.strMealThumb}">
          <h4>${meals.strMeal}</h4>
          <button type="button" class="more-details" id='${meals.idMeal}'> Recipe </button>
          ${
              favouriteArray.includes(meals.idMeal) ? `<a href="" class='favourite clicked' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>` : `<a href="" class='favourite' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`
          }`;

            searchresults.append(itemdiv);

          var recipe=document.querySelectorAll(".more-details");
          for(let button of recipe){
              button.addEventListener('click', moreDetails);
          }

              var favoriteButton = document.querySelectorAll('a');
          for (let button of favoriteButton) {
            button.addEventListener('click', toggleFavorites);
          }

      }
}

// this method calls the create method 
function displaySearchResults(){
   const keyword= inputvalue.value;
   //console.log(keyword);
   URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`;
   createMeals(URL);
}

// to display items in favourite button
async function displayFavoriteMeals() {
     searchresults.innerHTML = '';
  
    for (let meal of favouriteArray) {
      
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`);
      const data = await response.json();
  
      let meals = data.meals[0];
      
  
      const div = document.createElement('div');
      div.classList.add('items');
      div.innerHTML = `
        <img src="${meals.strMealThumb}" alt="">
        <h4>${meals.strMeal}</h4>
        <button type="button" class='border-circle more-details' id='${meals.idMeal}'>Recipe</button>
        <a href="" class='favourite clicked' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`;
  
        searchresults.append(div);
  
      var favoriteButton = document.querySelectorAll('a');
      for (let button of favoriteButton) {
        button.addEventListener('click', toggleFavorites);
      }
  
      var moreDetailsbutton = document.querySelectorAll('.more-details');
      for (let button of moreDetailsbutton) {
        button.addEventListener('click', moreDetails);
      }
    }
}

//Event Listners
myFavoriteMeals.addEventListener('click', displayFavoriteMeals); 
inputvalue.addEventListener('input', displaySearchResults);