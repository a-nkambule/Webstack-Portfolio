const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipes = document.querySelector(".recipes");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

// Function to get recipes
const fetchRecipes = async (query) => {
  recipes.innerHTML = "<h2>Fetching Recipes...</h2>";

  const data = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
  const response = await data.json();

  recipes.innerHTML = "";
  response.meals.forEach((meal) => {
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe");
    recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea} </span>Dish</p>
        <p> Belongs to <span>${meal.strCategory} </span>Category</p>

        `;
    const button = document.createElement("button");
    button.textContent = "View Recipe";
    recipeDiv.appendChild(button);

    //Adding EventListener to recipe button
    button.addEventListener("click", () => {
      openRecipePopup(meal);
    });

    recipes.appendChild(recipeDiv);
  });
};

// Function to Fetching Ingredients and measurements
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};
const openRecipePopup = (meal) => {
  recipeDetailsContent.textContent = `
     <h2 class="recipeName">${meal.strMeal}</h2>
     <h3>Ingredients:</h3>
     <ul class="ingredientList">${fetchIngredients(meal)}</ul>
     <div>
       <h3> Instructions:</h3>
       <p class="recipeInstructions">${meal.strInstructions}</p>
     </div>
    `;
  recipeDetailsContent.parentElement.style.display = "block";
};

recipeCloseBtn.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

var elements = document.getElementsByClassName(".recipe-section");

for (i = 0; i < elements.length; i++) {
  try {
    // rather brutal way
    elements[i].classList.remove("recipe-section");
  } catch (ex) {}
  elements[i].classList.add("recipe-section_invisible");
}

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (!searchInput) {
    recipes.innerHTML = `<h2> Type the meal in the search box.</h2>`;
    return;
  }
  fetchRecipes(searchInput);
});
