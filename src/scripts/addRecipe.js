// should recieve a website url to be inputed
const APIKey = '85859c45fa7949ec8b915c61690f2ce1';

// https://foodista.com/recipe/ZHK4KPB6/chocolate-crinkle-cookies

const localStorage = window.localStorage;

// promte user to enter data for add new recipe
const addBar = document.querySelector('.add-container');
const inputHTML = document.querySelector('.add-bar');
addBar.querySelector('button').addEventListener('click', addRecipe);

async function extraction (input) {
  let data = {};
  console.log('using');
  const format = {
    method: 'GET',
    url: 'https://api.spoonacular.com/recipes/extract',
    params: {
      url: input,
      forceExtraction: false,
      analyze: false,
      includeNutrition: false,
      includeTaste: false,
      apiKey: APIKey
    }
  };
  await axios.request(format).then(function (response) {
    data = response.data;
  }).catch(function (error) {
    data = forceExtraction(input);
    console.log(error);
  });
  return data;
}
async function forceExtraction (input) {
  let data = {};
  console.log('using');
  const format = {
    method: 'GET',
    url: 'https://api.spoonacular.com/recipes/extract',
    params: {
      url: input,
      forceExtraction: true,
      analyze: false,
      includeNutrition: false,
      includeTaste: false,
      apiKey: APIKey
    }
  };
  await axios.request(format).then(function (response) {
    data = response.data;
    return data;
  }).catch(function (error) {
    console.log(error);
  });
}

/**
 * add Recipe to recipe_list.html, update localStorage
 */
async function addRecipe () {
  const inputData = inputHTML.value;

  // grab maps from localStorage for insertion and replacement
  const hashMap = new Map(JSON.parse(localStorage['0']));
  const favMap = new Map(JSON.parse(localStorage['2']));
  const delMap = new Map(JSON.parse(localStorage['3']));
  const urlMap = new Map(JSON.parse(localStorage['5']));

  // BASE CASES PRIOR TO CONTINUING TO ALTER LOCAL STORAGE:
  // add recipe only if not duplicated
  if (checkDup(inputData)) {

    // returned true for duplicate, so now check if it was marked true in the delmap
    const id = urlMap.get(inputData);
    if (delMap.get(id) === true) {
      alert('This url existed but was previously deleted. Will now add back to view.');
      // edit delmap value
      delMap.set(id, false);
      // replace delmap in local
      localStorage.setItem(3, JSON.stringify(Array.from(delMap.entries())));
      // now unhide the card
      document.getElementById(id).classList.remove('deleted');
      return;
    } 

    // if it wasn't in delmap, it's a duplicate add
    alert('Duplicated recipe.');
    return;
  }

  // IF WE GET HERE, THAT MEANS THE RECIPE HAS NEVER BEEN ADDED BEFORE, SO DIDN'T EXIST IN URLMAP

  const recipetoHash = await extraction(inputData);
  // Now check if the url is valid
  if (typeof recipetoHash === 'undefined') {
    alert('Not a valid url');
    return;
  }

  // GOOD TO GO!
  // grab json file, and begin creating a recipe card with it
  console.log('heres the json of your added recipe:');
  console.log(recipetoHash);
  const main = document.querySelector('main');
  const element = document.createElement('recipe-card');

  // generate a random valid id because it's added with an id of -1
  const validID = Math.floor(Math.random() * 1000);

  // set values in maps for newly added card
  hashMap.set(recipetoHash.title, validID);
  favMap.set(validID, false);
  delMap.set(validID, false);
  urlMap.set(recipetoHash.sourceUrl, validID); // urlmap's value is for store id to check for dulipated.
  
  // also edit the inner ID of json file
  recipetoHash.id = validID;
  const recipeData = JSON.stringify(recipetoHash);

  // update local storage
  localStorage.setItem(validID, recipeData);
  localStorage.setItem(0, JSON.stringify(Array.from(hashMap.entries())));
  localStorage.setItem(2, JSON.stringify(Array.from(favMap.entries())));
  localStorage.setItem(3, JSON.stringify(Array.from(delMap.entries())));
  localStorage.setItem(5, JSON.stringify(Array.from(urlMap.entries())));

  // update recipe card in html
  element.data = recipeData;
  element.id = validID;
  if (delMap.get(element.id) === true) {
    element.classList.add('deleted');
  }
  main.appendChild(element);

  alert('Your new card is inserted~');

  // go to expand card view
  element.addEventListener('click', (e) => {
    window.location.href = '../recipe_expand/recipe_expand.html' + '#' + element.id;
  });
}

/**
 * Check if the recipe is already in the localStorage
 * @param {String} url url which comes from user input
 * @returns {Boolean} true if there already exists a url, false if not
 */
function checkDup (url) {
  const urlMap = new Map(JSON.parse(localStorage['5']));
  // if url map doesn't contain url, then we want to return false for duplication
  if (!urlMap.has(url)) {
    console.log('false');
    return false;
  }

  // if we get here then url has been inserted. could possibly be hidden from being marked true in delmap
  return true;
}
