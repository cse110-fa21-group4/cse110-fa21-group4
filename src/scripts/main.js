/**
 * MAIN.JS FILE
 * Location of init function where backend fetches the recipes from the API
 * and stores the json files into local storage. Local storage will contain
 * a hashmap that maps a recipe title to a key, and the key will map to the
 * respective json file. Functions searchTitle, searchForKey, and
 * getRecipesContainingKeyword will fetch recipes from search bar input.
 * Lastly, backend functionallity allows frontend to populate the cards and
 * single recipe pages.
 */

import { ComplexSearch } from './apiComplexSearch.js';
import { GenericFetch } from './genericFetch.js';
import { fillPopular } from './popularRecipes.js';

// Backend devs will switch up using their own spoonacular key for fetching
const API_KEY = '25a57bde9e504ec9a6717d2b4b87a753';

window.addEventListener('DOMContentLoaded', init);
// LOCAL STORAGE
const localStorage = window.localStorage;

/**
 * INITIALIZE FUNCTION where recipes will be fetches as soon as website is booted up.
 * Will send out a request to api to fetch 0-100 recipes and then populate local storage
 * to hold all recipe id's as keys and their json files as the values. Will also
 * create a hashmap to map titles to id's, favmap and del map to map id's to booleans,
 * a popular array to hold top rated recipes for homepage view, and lastly a urlmap
 * that that holds url as key and id as a value to keep track of duplicated added recipes.
 */
async function init () {
  // initializeServiceWorker(); will eventually implement

  if (localStorage.length === 0) {
    const initialSearch = {
      method: 'GET',
      url: 'https://api.spoonacular.com/recipes/complexSearch',
      params: {
        query: ' ', // The (natural language) recipe search query.
        offset: 0, // The number of results to skip (between 0 and 900).
        number: 100, // The number of expected results (between 1 and 100).
        apiKey: API_KEY
      }
    };

    const search = new ComplexSearch(initialSearch);
    await ComplexSearch.fComplexSearch(search);
    // console.log(search.data);

    // grabbing recipes with id's
    let idString = '';

    // making hash table that maps titles (key) to recipe id's (values)
    const hashmap = new Map();
    for (const elem of search.data.results) {
      hashmap.set(elem.title, elem.id);
      idString = idString + elem.id + ',';
    }

    // SANAT
    const objSanat = {
      analyzedInstructions: [{ name: '', steps: [{ equipment: [], ingredients: [], number: 1, step: '' }] }],
      servings: '\u221E',
      title: 'Sanat',
      summary: 'Sanat is 1 part hot cocoa by the fire, 2 parts earthy love, 3 parts long embrace after a hard day, 4 parts pile of puppies, a pinch of your cheek by grandma, and a dash of "go get em tiger". You will not regret this recipe!',
      id: 1,
      image: 'https://avatars.githubusercontent.com/u/31770675?v=4',
      extendedIngredients: [{ amount: 1, unit: '', originalName: 'naan bread' }, { amount: 1, unit: '', originalName: 'spices' }, { amount: 1, unit: '', originalName: 'hot dog' }],
      cheap: true,
      dairyFree: false,
      glutenFree: false,
      vegan: false,
      vegetarian: false,
      healthy: false
    };
    hashmap.set(objSanat.title, 1);
    localStorage.setItem(1, JSON.stringify(objSanat));

    // console.log(JSON.stringify(Array.from(hashmap.entries())));
    // console.log(search.data.results);

    const bulkOptions = {
      method: 'GET',
      url: 'https://api.spoonacular.com/recipes/informationBulk',
      params: {
        ids: idString,
        includeNutrition: false,
        apiKey: API_KEY
      }
    };

    const thing = new GenericFetch(bulkOptions);
    await GenericFetch.fGenericFetch(thing);
    console.log(thing.data);

    // FILLING LOCAL STORAGE
    // create a popular array to place into local storage
    const popularArr = [];
    // first set a place in local storage that will hold the hash table itself at key 0
    localStorage.setItem(0, JSON.stringify(Array.from(hashmap.entries())));

    // extract json object and put into local storage
    for (const elem of thing.data) {
      localStorage.setItem(elem.id, JSON.stringify(elem));

      // fill popularArr
      if (elem.spoonacularScore >= 30) {
        popularArr.push(elem.id);
      }
    }
    console.log('we are here');

    // MAKING FAVORITES HASHMAP THAT WILL BE LOCATED AT #2 IN LOCAL STORAGE
    const favmap = new Map();
    // MAKING DELETES HASHMAP THAT WILL BE LOCATED AT #3 IN LOCAL STORAGE
    const deletedMap = new Map();
    // URL map to keep track of duplicate inputs for addRecipe
    const urlMap = new Map();

    // get hash table
    const hashes = JSON.parse(localStorage['0']);
    // get array of ids
    const elementIdArr = hashes.map(h => h[1]);

    for (let i = 0; i < elementIdArr.length; i++) {
      // initialze every id as false (not yet a favorite or deleted)
      favmap.set(elementIdArr[i], false);
      deletedMap.set(elementIdArr[i], false);
    }
    urlMap.set('2046', 'none');
    // store the fav map into local
    localStorage.setItem(2, JSON.stringify(Array.from(favmap.entries())));
    // store the del map into local
    localStorage.setItem(3, JSON.stringify(Array.from(deletedMap.entries())));
    // store popular array
    localStorage.setItem(4, JSON.stringify(popularArr));
    // store URL map to check duplicated issue in add
    localStorage.setItem(5, JSON.stringify(Array.from(urlMap.entries())));

    console.log('local storage has ', localStorage.length, ' elements, which is 5 hashmaps, Sanats card, and ', localStorage.length - 6, 'recipes');
    alert('Local storage populated. You may now naviage freely.');
  }

  // fill popular recipes
  fillPopular();
}
