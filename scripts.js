let currentPageNumber = 0;
let filteredMeals = meals;
let filterIngredientsSize = 0;
let filterPrices = 0;
let filterTime = 0;
const originalMeals = [...meals];
let favouritesList = [];
let allergiesList = [];
let sortAlpha = false;
let sortReverseAlpha = false;
let sortFavourites = false;
const maxPerPage = 20;
let light = 11;
let moderate = 12;
let advanced = 15;
let cheap = 8.36;
let regular = 11.5;
let expensive = 12.5;
let quick = 35;
let average = 36;
let long = 46;

getIngredientsSizing(meals);

function showCards() {
  let cardContainer = document.getElementById("card-container");
  let defaultCard = document.querySelector(".card");
  for (let i = currentPageNumber; i < currentPageNumber + maxPerPage && i < filteredMeals.length; i++) { 
    let meal = filteredMeals[i];
    let displayCard = defaultCard.cloneNode(true); 
    createMealCard(displayCard, meal);
    displayCard.addEventListener("click", () => {
      showIngredientsPanel(meal);
    });
    cardContainer.appendChild(displayCard);
  }
  currentPageNumber += maxPerPage;
}

function createMealCard(displayCard, meal) {
  displayCard.style.display = "block";

  let cardHeader = displayCard.querySelector("h2");
  cardHeader.textContent = meal.title;

  let cardImage = displayCard.querySelector("img");
  cardImage.src = meal.image;
  cardImage.alt = meal.title;

  let difficultyLabel = displayCard.querySelector(".difficulty");
  difficultyLabel.classList.remove("easy", "medium", "hard");

  let deleteButton = displayCard.querySelector(".deleteButton");

  if(meal.ingredients.length <= light){
    difficultyLabel.textContent = "Easy";
    difficultyLabel.classList.add("easy");
  } else if(meal.ingredients.length >= moderate && meal.ingredients.length < advanced){
    difficultyLabel.textContent = "Medium";
    difficultyLabel.classList.add("medium");
  } else {
    difficultyLabel.textContent = "Hard";
    difficultyLabel.classList.add("hard");
  }

  let priceLabel = displayCard.querySelector(".price");
  if(meal.estimatedCostUSD < cheap){
    priceLabel.textContent = "$";
  } else if(meal.estimatedCostUSD < expensive){
    priceLabel.textContent = "$$";
  } else {
    priceLabel.textContent = "$$$";  }

  let timeLabel = displayCard.querySelector(".time");
  if(meal.estimatedCookTimeMins <= quick){
    timeLabel.textContent = `${meal.estimatedCookTimeMins} mins`;
  } else if(meal.estimatedCookTimeMins > quick && meal.estimatedCookTimeMins < average){
    timeLabel.textContent = `${meal.estimatedCookTimeMins} mins`; 
  } else {
    timeLabel.textContent = `${meal.estimatedCookTimeMins} mins`;
  }

  let heartButton = displayCard.querySelector(".favouriteButton");

  if (favouritesList.includes(meal.title)) {
    heartButton.textContent = "♥";
  } else {
    heartButton.textContent = "♡";
  }

  heartButton.addEventListener("click", (event) => {
    event.stopPropagation();
    let alreadyFavourite = favouritesList.includes(meal.title);
    if(alreadyFavourite){
      favouritesList = favouritesList.filter(title => title !== meal.title);
      heartButton.textContent = "♡";
    } else {
      favouritesList.push(meal.title);
      heartButton.textContent = "♥";
    }
  });

  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation(); 
    let index = meals.findIndex(i => i.title == meal.title);
    if (index != -1) {
      meals.splice(index, 1);
      originalMeals.splice(index, 1);           
      filteredMeals = [...originalMeals];     
      currentPageNumber = 0;
      document.getElementById("card-container").innerHTML = "";
      showCards();                     
    }
  });

}

function filterCards(search) {
  let cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  currentPageNumber = 0;

  if(search){ //SEARCH BAR
    filteredMeals = meals.filter(meal => meal.title.toLowerCase().includes(search));
  } else {
    filteredMeals = [...originalMeals];
  }

  if(filterIngredientsSize != 0){ //SORT BY PREP SIZE OR INGREDIENT SIZE
    filteredMeals = filteredMeals.filter(meal => {
      if(filterIngredientsSize == 1) return meal.ingredients.length <= light;
      if(filterIngredientsSize == 2) return meal.ingredients.length >= moderate && meal.ingredients.length < advanced;
      if(filterIngredientsSize == 3) return meal.ingredients.length >= advanced;
    })
  };

  if(filterPrices != 0){ //SORT BY PRICE
    filteredMeals = filteredMeals.filter(meal => {
      if(filterPrices == 1) return meal.estimatedCostUSD <= cheap;
      if(filterPrices == 2) return meal.estimatedCostUSD > cheap && meal.estimatedCostUSD <= regular;
      if(filterPrices == 3) return meal.estimatedCostUSD >= expensive;
    })
  };

  if(filterTime != 0){ //SORT BY TIME
    filteredMeals = filteredMeals.filter(meal => {
      if(filterTime == 1) return meal.estimatedCookTimeMins <= quick;
      if(filterTime == 2) return meal.estimatedCookTimeMins >= average && meal.estimatedCookTimeMins < long;
      if(filterTime == 3) return meal.estimatedCookTimeMins >= long;
    })
  }

  if(sortAlpha){ //ALPHABETICAL SORT
    filteredMeals.sort((x,y) => x.title.localeCompare(y.title));
  } else if (sortReverseAlpha){
    filteredMeals.sort((x,y) => y.title.localeCompare(x.title));
  }

  if(sortFavourites){ //BY FAVOURITES
    filteredMeals = filteredMeals.filter(meal => favouritesList.includes(meal.title));
  }

  if (allergiesList.length > 0) { //FILTER ALLERGIES AND DISLIKES
    filteredMeals = filteredMeals.filter(meal =>
      !allergiesList.some(allergen =>
        meal.ingredients.some(ingredient => ingredient.toLowerCase().includes(allergen))
      )
    );
  }

  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  showCards();
}

function showIngredientsPanel(meal){
  let ingredientsPanel = document.getElementById("ingredientsPanel");
  let title = document.getElementById("mealTitle");
  let list = document.getElementById("ingredientsList");
  let instructionsList = document.getElementById("instructionsList");

  title.textContent = meal.title;
  list.innerHTML = "";
  meal.ingredients.forEach(ingredient => {
    let li = document.createElement("li");
    li.textContent = ingredient;
    list.appendChild(li);
  });

  instructionsList.innerHTML = "";
  meal.instructions.forEach(instruction =>{
    let li = document.createElement("li");
    li.textContent = instruction;
    instructionsList.appendChild(li);
  });

  ingredientsPanel.classList.remove("hidden");
}

function quoteAlert() {
  console.log("Button Clicked!");
  alert(
    "I guess I can kiss heaven goodbye, because it got to be a sin to look this good!"
  );
}

document.addEventListener("DOMContentLoaded", () => {
  showCards();
  showIngredientsPanel(meals[0]);

  document.getElementById("closeIngredientsPanel").addEventListener("click", () => {
    document.getElementById("ingredientsPanel").classList.add("hidden");
  });  

  document.getElementById("searchInput").addEventListener("input", function () {
    let search = this.value.toLowerCase();
    filterCards(search);
  });

  document.getElementById("sortAlphaButton").addEventListener("click", () => {
    sortAlpha = !sortAlpha;
    sortReverseAlpha = false;
    updateButtons();
    filterCards(document.getElementById("searchInput").value.toLowerCase());
  });

  document.getElementById("sortReverseAlphaButton").addEventListener("click", () => {
    sortReverseAlpha = !sortReverseAlpha;
    sortAlpha = false;
    updateButtons();
    filterCards(document.getElementById("searchInput").value.toLowerCase());
  });

  document.getElementById("sortFavouritesButton").addEventListener("click", () => {
    sortFavourites = !sortFavourites;
    updateButtons();
    filterCards(document.getElementById("searchInput").value.toLowerCase());
  });

  document.getElementById("prepFilter").addEventListener("change", function () {
    filterIngredientsSize = parseInt(this.value);
    filterCards(document.getElementById("searchInput").value.toLowerCase());
  });

  document.getElementById("priceFilter").addEventListener("change", function () {
    filterPrices = parseInt(this.value);
    filterCards(document.getElementById("searchInput").value.toLowerCase());
  });

  document.getElementById("timeFilter").addEventListener("change", function () {
    filterTime = parseInt(this.value);
    filterCards(document.getElementById("searchInput").value.toLowerCase());
  });

  document.getElementById("allergenInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      let allergen = this.value.trim().toLowerCase();
      if (allergen && !allergiesList.includes(allergen)) {
        allergiesList.push(allergen);
        this.value = "";
        refreshAllergyList();
        filterCards(document.getElementById("searchInput").value.toLowerCase());
      }
    }
  });

  document.getElementById("openCustomMealPanel").addEventListener("click", () => {
    document.getElementById("customMealPanel").classList.remove("hidden");
  });
  
  document.getElementById("closeCustomMealPanel").addEventListener("click", () => {
    document.getElementById("customMealPanel").classList.add("hidden");
  });
  
  document.getElementById("submitCustomMeal").addEventListener("click", () => {
    let title = document.getElementById("customMealTitle").value.trim();
    let cost = parseFloat(document.getElementById("customMealCost").value);
    let time = parseInt(document.getElementById("customMealTime").value);
    let ingredients = document.getElementById("customMealIngredients").value.split(",");
    let instructions = document.getElementById("customMealInstructions").value.split(",");
    let imageInput = document.getElementById("customMealImage");

    if (!title || isNaN(cost) || isNaN(time) || ingredients.length === 0 || instructions.length === 0) {
      alert("Please fill out all fields");
      return;
    }

    let defaultCard = document.querySelector(".card");
    let newCard = defaultCard.cloneNode(true);
    let cardContainer = document.getElementById("card-container");

    function handleNewMeal(imageSrc) {
      const newMeal = {
        title,
        estimatedCostUSD: cost,
        estimatedCookTimeMins: time,
        ingredients,
        instructions,
        image: imageSrc
      };

      meals.push(newMeal);
      originalMeals.push(newMeal);
      createMealCard(newCard, newMeal);
      cardContainer.appendChild(newCard);
      document.getElementById("customMealPanel").classList.add("hidden");
      filterCards(document.getElementById("searchInput").value.toLowerCase());
    }

    if (imageInput.files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = function(e) {
        handleNewMeal(e.target.result);
      };
      fileReader.readAsDataURL(imageInput.files[0]);
    } else {
      handleNewMeal("images/default.jpg");
    }
  });  

  document.getElementById("openMealPlannerPanel").addEventListener("click", () => {
    refreshSelectedMeals();
    document.getElementById("mealPlannerPanel").classList.remove("hidden");
  });
  
  document.getElementById("closeMealPlannerPanel").addEventListener("click", () => {
    document.getElementById("mealPlannerPanel").classList.add("hidden");
  });
  
  document.getElementById("saveMealPlan").addEventListener("click", () => {
    let breakfast = document.getElementById("breakfastSelect").value;
    let lunch = document.getElementById("lunchSelect").value;
    let dinner = document.getElementById("dinnerSelect").value;
  
    let display = document.getElementById("plannedMealsDisplay");

    display.innerHTML = `
      <li><strong>Breakfast:</strong> ${breakfast}</li>
      <li><strong>Lunch:</strong> ${lunch}</li>
      <li><strong>Dinner:</strong> ${dinner}</li>`;

    document.getElementById("plannedMealsList").style.display = "block";
    document.getElementById("mealPlannerPanel").classList.add("hidden");
  });
});

function updateButtons(){
  let AZButton = document.getElementById("sortAlphaButton");
  let ZAButton = document.getElementById("sortReverseAlphaButton");
  let favouriteButton = document.getElementById("sortFavouritesButton");


  if(sortAlpha){
    AZButton.classList.add("on");
    ZAButton.classList.remove("on");
  } else if(sortReverseAlpha){
    ZAButton.classList.add("on");
    AZButton.classList.remove("on");
  } else {
    AZButton.classList.remove("on");
    ZAButton.classList.remove("on");
  }

  if(sortFavourites){
    favouriteButton.classList.add("on");
  } else {
    favouriteButton.classList.remove("on");
  }
}


window.addEventListener("scroll", () => {
  let atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (atBottom) {
    showCards();
  }
});

function refreshAllergyList() {
  let allergenSearchBar = document.getElementById("allergenSearchBar");
  allergenSearchBar.innerHTML = "";
  allergiesList.forEach((allergen, index) => {
    
    let allergyItem  = document.createElement("div");
    allergyItem.className = "allergyItem";
    allergyItem.textContent = allergen;

    let closeButton = document.createElement("span");
    closeButton.textContent = "×";
    closeButton.onclick = () => {
      allergiesList.splice(index, 1);
      refreshAllergyList()
      filterCards(document.getElementById("searchInput").value.toLowerCase());
    };

    allergyItem.appendChild(closeButton);
    allergenSearchBar.appendChild(allergyItem);
  });
}

function getIngredientsSizing(meals) { //Runs once to get the numbers never used again
  let sortedIngredientsLength = meals.map(meal => meal.estimatedCookTimeMins).sort((a, b) => a - b);
  let total =  sortedIngredientsLength.length;

  let smallIndex = Math.floor(total / 3);
  let mediumIndex = Math.floor((2 * total) / 3);

  let small = sortedIngredientsLength[smallIndex];
  let medium = sortedIngredientsLength[mediumIndex];

  console.log(`S: <= ${small} ingredients`);
  console.log(`M: ${small + 1} to ${medium} ingredients`);
  console.log(`L: >= ${medium + 1} ingredients`);
}

function refreshSelectedMeals() {
  const selects = ["breakfastSelect", "lunchSelect", "dinnerSelect"];
  selects.forEach(id => {
    const select = document.getElementById(id);
    select.innerHTML = "";
    meals.forEach(meal => {
      const option = document.createElement("option");
      option.value = meal.title;
      option.textContent = meal.title;
      select.appendChild(option);
    });
  });
}