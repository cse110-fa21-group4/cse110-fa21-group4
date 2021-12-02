// should recieve a website url to be inputed
 const APIKey = '85859c45fa7949ec8b915c61690f2ce1';
 
 //https://foodista.com/recipe/ZHK4KPB6/chocolate-crinkle-cookies

 
 const localStorage = window.localStorage;

 //promte user to enter data for add new recipe
 const addBar = document.querySelector('.add-container');
 const inputHTML = document.querySelector('.add-bar');
 addBar.querySelector('button').addEventListener('click', addRecipe);
 
 
 //window.addEventListener('DOMContentLoaded', init);
 // extraction is a function that calls spoonacular api and returns a json for a specific  
 // recipie based on the input url that was passed in 
 async function extraction (input) {
  let data = {};
  console.log('using');
  // format is the object that will be passed into the request function and the params
  // will be used by spoonacular to determine what it needs to do when looking for and 
  // returning the json for the recipe 
  const format = {
    method: 'GET',
    url: 'https://api.spoonacular.com/recipes/extract',
    params: {
      url: input,
      // we keep forceExtraction to be false as this is a slower function that 
      // should only be used if information is missing and extraction doesn't work 
      forceExtraction: false,
      analyze: false,
      includeNutrition: false,
      includeTaste: false,
      apiKey: APIKey
    }
  };
  // async request from spoonacular api 
  await axios.request(format).then(function (response) {
    // save the data from the response we got to our data variable object
    data = response.data;
    // console.log(data);
    // if the function doesn't work for some reason we can try forceExtraction to 
    // get us a JSON and if that still doesn't work we will log the error in the 
    // next function 
  }).catch(function (error) {
    data = forceExtraction(input);
    //console.log(data);
    console.log(error);
  });
  // return the JSON object for the recipe we extracted from a website 
  return data;

}
// forceExtraction is a function that calls spoonacular api and returns a json for a specific 
// recipe based on the input url that was passed in. It should be used when extraction doesn't work
 async function forceExtraction (input) {
  let data = {};
  console.log('using');
  // we use a similar format object and param to call spoonacular 
  const format = {
    method: 'GET',
    url: 'https://api.spoonacular.com/recipes/extract',
    params: {
      url: input,
      // forceExtraction is set to true so spoonacular knows to use a different operation from 
      // extracion. It will be slower but should still return a json 
      forceExtraction: true,
      analyze: false,
      includeNutrition: false,
      includeTaste: false,
      apiKey: APIKey
    }
  };
  // async request from spoonacular api 
  await axios.request(format).then(function (response) {
   // save the data from the response we got to our data variable object
    data = response.data;
    // log the JSON to see if anything is weird 
    console.log(JSON.stringify(data));
    // return the JSON data we got from spoonacular api call 
    return data;
    // if there is still an error we have to catch it and log it
  }).catch(function (error) {
    //console.log(data);
    console.log(error);
  });
}
 

 /**
 * add Recipe to recipe_list.html, update localStorage
 */
 async function addRecipe()
 {
   const inputData = inputHTML.value;

   // add recipe onlt if not duplicated
   if(checkckDu(inputData)) {
    alert("Duplicated recipe.");
    return;
   }
   let recipetoHash = await extraction(inputData);
   // check if the url is valid
   if(typeof recipetoHash == 'undefined'){
     alert("Not a valid url");
     return;
   }
   let recipeData = JSON.stringify(recipetoHash);
   const main = document.querySelector("main");
   const element = document.createElement('recipe-card');

   // generate the vlaid id 
   let validID  = Math.random()*1000;
   
   // grab value from localStorage
    const hashMap = new Map(JSON.parse(localStorage['0']));
   const favMap = new Map(JSON.parse(localStorage['2']));
   const DelMap = new Map(JSON.parse(localStorage['3']));
   const urlMap = new Map(JSON.parse(localStorage['5']));

   // set value in map for new added card
   hashMap.set(recipetoHash.title, validID);
   favMap.set(validID, false);
   DelMap.set(validID, false);
   console.log(recipetoHash.sourceUrl);

   // urlmap's value is for store id to check for dulipated.
   urlMap.set(recipetoHash.sourceUrl, validID);   

   // update local storage
   localStorage.setItem(validID, recipeData);
   localStorage.setItem(0, JSON.stringify(Array.from(hashMap.entries())));
   localStorage.setItem(2, JSON.stringify(Array.from(favMap.entries())));
   localStorage.setItem(3, JSON.stringify(Array.from(DelMap.entries())));
   localStorage.setItem(5, JSON.stringify(Array.from(urlMap.entries())));

   // updated recipe card  in html
   element.data = recipeData;
   element.id = validID;
   if(DelMap.get(element.id) === true) {
       element.classList.add('deleted');
   }
   main.appendChild(element);

   alert("Your new card is inserted~");

   // go to expand card view
   element.addEventListener('click', (e) => {
   window.location.href = '../recipe_expand/recipe_expand.html' + '#' + element.id;
   });
 }

 /**
 * Check if the recipe is already in the localStorage
 * @param {String} urll url which comes from user input
 * @returns {Boolean} true if there exist, false if not.
 */
function checkckDu(urll)
{
  const delHash = new Map(JSON.parse(localStorage['3']));
  const urlHash = new Map(JSON.parse(localStorage['5']));
  // if url is empty, means no url is added before, return false
  if(!urlHash.has(urll)) {
    console.log("false");
    return false;
  }
  // or url is not empty, deleteMap is true, meaning the added recipe has been deleted, return false
  if(delHash.get(urlHash.get(urll)) == true) {
    console.log(urlHash.get(urll));
      return false;
  }
  return true;
}