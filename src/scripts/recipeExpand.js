import { searchForKey } from './searchKey.js';

// The ID of the recipe that we clicked on to get recipe expand.
const recipeId = window.location.hash.substring(1);
const localStorage = window.localStorage;

// Initialize creating the recipe expand page.
window.addEventListener('DOMContentLoaded', init);

/**
 * **************************INIT FUNCTION*************************************** *
 * This function is simply just called when we load the recipe expand page. It    *
 * just calls the createRecipeExpand() function which will create the html        *
 * structure of the recipe expand page.                                           *
 * ****************************************************************************** *
 */
async function init () {
  createRecipeExpand();
  bindDelete();
}

/**
 * **************************CREATERECIPEEXPAND FUNCTION************************* *
 * Grabs the #id url fragment that was appended when we clicked on a recipe card  *
 * and creates the html structure of the recipe expand page by passing in the     *
 * data string from localStorage into a custom recipe-card-expand-container. See  *
 * recipeCardExpand.js for how this data is parsed.                               *
 * ****************************************************************************** *
 */
function createRecipeExpand () {
  const main = document.querySelector('main');
  const element = document.createElement('recipe-card-expand-container');
  element.data = localStorage.getItem(recipeId);
  element.id = recipeId;
  main.appendChild(element);
}

// TODO: Figure out a nicer way to iterate through children and selectively replace
// children with forms that have input for 1 line, and textarea for multiple lines.
export function editRecipe () {
  console.log('edit');
  // Example selecting the shadowroot + recipe expand container
  const recipeExpandRoot = document.querySelector('recipe-card-expand-container').data;
  const recipeExpandContainer = recipeExpandRoot.querySelector('.recipe-expand-grid-container');
  const recipeInputForm = recipeExpandRoot.querySelector('.recipe-form');

  recipeInputForm.classList.remove('hidden');
  recipeInputForm.children[0].classList.remove('hidden');

  const editButtonDiv = recipeExpandContainer.querySelector('.edit-div');
  editButtonDiv.classList.add('hidden');
  editButtonDiv.querySelector('.editbtn').classList.add('hidden');

  const submitButtonDiv = recipeExpandContainer.querySelector('.submit-div');
  submitButtonDiv.classList.remove('hidden');
  submitButtonDiv.querySelector('.submitbtn').classList.remove('hidden');
  // recipeExpandContainer.replaceChild(recipeTitleForm, recipeExpandContainer.children[0]);

  // Swap the button as an example, realistically our implementation
  // should have another button that appears + dissapears probably near bottom.
}

// TODO: Figure out how to parse multiple lines into one large div containing <li>
export function saveRecipe () {
  console.log('save');
  // Example selecting the shadowroot + title form container
  const recipeExpandRoot = document.querySelector('recipe-card-expand-container').data;
  const recipeExpandContainer = recipeExpandRoot.querySelector('.recipe-expand-grid-container');
  const recipeInputForm = recipeExpandRoot.querySelector('.recipe-form');
  const editButtonDiv = recipeExpandContainer.querySelector('.edit-div');
  editButtonDiv.classList.remove('hidden');
  editButtonDiv.querySelector('.editbtn').classList.remove('hidden');

  const submitButtonDiv = recipeExpandContainer.querySelector('.submit-div');
  submitButtonDiv.classList.add('hidden');
  submitButtonDiv.querySelector('.submitbtn').classList.add('hidden');

  // Example getting the title form + class
  // Recipe Title
  const servings = recipeInputForm.children[0].value;
  updateRecipeServings(servings);

  const recipeServingContainer = recipeExpandContainer.querySelector('.recipe-expand-servings-time-container');
  recipeServingContainer.querySelector('.recipe-servings').innerText = servings;

  const ingredientContainer = recipeExpandContainer.querySelector('.recipe-expand-ingredients-container');
  const recipeExpandIngredientsList = document.createElement('ul');
  recipeExpandIngredientsList.classList.add('recipe-expand-ingredients-list');
  recipeExpandIngredientsList.id = 'ingredientList';
  recipeExpandIngredientsList.innerText = 'Ingredients:';
  const recipeId = document.querySelector('recipe-card-expand-container').id;
  const recipe = JSON.parse(localStorage[recipeId]);
  const ingredientsList = searchForKey(recipe, 'extendedIngredients');

  for (let i = 0; i < ingredientsList.length; i++) {
    const recipeExpandIngredients = document.createElement('li');
    if (ingredientsList[i].unit === '') {
      recipeExpandIngredients.innerText = ingredientsList[i].amount + ' ' + ingredientsList[i].originalName;
    } else {
      recipeExpandIngredients.innerText = ingredientsList[i].amount + ' ' + ingredientsList[i].unit + ' ' + ingredientsList[i].originalName;
    }
    recipeExpandIngredientsList.appendChild(recipeExpandIngredients);
  }
  const oldIngredients = recipeExpandContainer.querySelector('.recipe-expand-ingredients-container').querySelector('.recipe-expand-ingredients-list');
  // console.log(oldIngredients);
  oldIngredients.remove();

  ingredientContainer.appendChild(recipeExpandIngredientsList);
  recipeInputForm.classList.add('hidden');
  recipeInputForm.children[0].classList.add('hidden');
}

function bindDelete () {
  document.querySelector('.deletebtn').addEventListener('click', function () { deleteRecipe(document.querySelector('recipe-card-expand-container').id); });
}

/**
 *
 * @param {*} id , Id of Recipe to Delete
 */
function deleteRecipe (id) {
  // get hash table
  const deletedMap = new Map(JSON.parse(localStorage['3']));
  deletedMap.set(parseInt(id), true);
  localStorage.setItem(3, JSON.stringify(Array.from(deletedMap.entries())));
}

/**
 *
 * @param {*} numServings , number of servings to modify the recipe's ingredients
 */
function updateRecipeServings (numServings) {
  const recipeExpandRoot = document.querySelector('recipe-card-expand-container').data;
  const recipeExpandContainer = recipeExpandRoot.querySelector('.recipe-expand-grid-container');
  const recipeServingContainer = recipeExpandContainer.querySelector('.recipe-expand-servings-time-container');
  const currServings = recipeServingContainer.querySelector('.recipe-servings').innerText;
  recipeServingContainer.querySelector('.recipe-servings').innerText = numServings;

  if (isNaN(numServings)) {
    alert('Your Serving Amount is Not a Number, Try Again');
    return;
  }
  if (currServings === numServings) {
    return;
  }
  const difference = numServings / currServings;
  const recipeId = document.querySelector('recipe-card-expand-container').id;
  const recipe = JSON.parse(localStorage[recipeId]);
  const recipeIngredients = recipe.extendedIngredients;
  for (let i = 0; i < recipeIngredients.length; i++) {
    const numIngredient = recipeIngredients[i].amount;
    recipeIngredients[i].amount = numIngredient * difference;
  }
  recipe.servings = numServings;
  localStorage.setItem(recipeId, JSON.stringify(recipe));
}
