/* eslint-disable spaced-comment */
import { searchForKey, getInstructionSteps } from './searchKey.js';
// this const contains the css for our webpage
const elemStyle = `
.title {
  font-family: 'Bebas Neue', cursive;
  text-align: center;
  color: #e3d477;
  padding: 3vh 0 2vh 0;
  font-size: 3.7rem;
}

.layout {
  width: 90%;
  margin: 0 auto;
  max-width: 1100px;
}

.recipe-image {
  max-width: 30%;
  max-height: 30%;
}

.direction {
  margin-top: 2rem;
}

.direction h4 {
  color: black;
}

.direction-block {
  background-color: #e6d2af;
  color: black;
  padding: 4rem 2rem;

  display: flex;
  align-items: center;
  justify-content: center;
}

.navigate {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 1rem;
}

.navigate button {
  /* reset button */
  background-color: #e6d2af;
  color: black;
  border: none;
  width: 50px;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  border-radius: 50%;
}

`;

class CookView extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   *  @return {*} The HTML structure of recipe expand
   */
  get data () {
    return this.shadowRoot;
  }

  /**
   *  @param {String} data The data to turn into JSOn and parse.
   */
  set data (data) {
    // parse the data from localstorage to get a JSON objectt
    const parsed = JSON.parse(data);
    // console.log(parsed);

    // create a style element we will be appending to the shadowroot later
    // set to the css above
    const styleElem = document.createElement('style');
    styleElem.innerHTML = elemStyle;

    // Create some elements we will attach to main, the html page, later on
    const container = document.createElement('div');

    const title = document.createElement('h3');
    // set the name of the recipe using searchForKey and instruction array using getInstructionSteps
    title.innerText = searchForKey(parsed, 'title');

    const instructionsList = getInstructionSteps(parsed);

    // we count how many instruction steps there are
    const maxStepCount = instructionsList.length;

    //#region  //*=========== Step ===========
    // We create more elements that we will use to populate the html page
    const step = document.createElement('p');
    const startStep = document.createElement('span');
    startStep.innerText = '1';
    startStep.id = 'startStep';
    const maxStep = document.createElement('span');
    maxStep.id = 'maxStep';
    maxStep.innerText = maxStepCount;
    // above we created spans of step #'s that were set to the first step and last step
    // number respectively below we append to the step <p> and some stings to get something like Step 1/6
    step.innerText = 'Step ';
    step.appendChild(startStep);
    step.innerHTML += '/';
    step.appendChild(maxStep);
    //#endregion  //*======== Step ===========

    //#region  //*=========== Img ===========
    // create the img element and set it to the image from the JSON data read in
    const img = document.createElement('img');
    img.src = parsed.image;
    img.classList.add('recipe-image');
    img.alt = 'Recipe Image';
    //#endregion  //*======== Img ===========

    //#region  //*=========== Direction ===========
    // need direction + number to keep track of which direction we are on
    const directionNum = document.createElement('h4');
    directionNum.innerHTML = "Direction <span id='directNum'>1</span>";

    //direction container to add direction elements too
    const directionContainer = document.createElement('div');
    directionContainer.classList.add('direction');

    // we need this block for css it's a nice looking box which we append directions to
    const directionBlock = document.createElement('div');
    directionBlock.classList.add('direction-block');

    // this is the actual instruction step being parsed from the instructionlist arr starting at [0]
    const direction = document.createElement('p');
    direction.id = 'direction';
    direction.innerText = instructionsList[0].step;

    // append everything to the container in correct order below
    directionContainer.appendChild(directionNum);
    directionBlock.appendChild(direction);
    directionContainer.appendChild(directionBlock);
    //#endregion  //*======== Direction ===========

    //#region  //*=========== Navigate ===========
    // we will attach buttons to this navigate div we just created
    const navigate = document.createElement('div');
    navigate.classList.add('navigate');

    // left button to go back in direction steps iterate array from right to left
    const buttonLeft = document.createElement('button');
    // this makes the button look nice I think
    buttonLeft.innerHTML = `
      <span
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    `;
    // clicking the left button causes you to go the previous instruction step (if not on step 1 already)
    // it makes everything on the webpage update to be consistent with this change
    buttonLeft.addEventListener('click', () => {
      // we have our list of instructions we want to know which step we are on so we know which new
      // instruction we should get
      const instructionsList = getInstructionSteps(parsed);
      // this sets startStepE1 pointed to the 'startStep' span number in the html page and parses the
      // inner number to be an int
      const startStepEl = this.shadowRoot.getElementById('startStep');
      const startStep = parseInt(startStepEl.innerText);
      // we can only go back a step if we are not on the first step
      if (startStep > 1) {
        // set the new 'startStep' through pointer startStepE1 to be -= 1
        startStepEl.innerText = startStep - 1;
        // we also want the direction number to match the step number so we grab 'directNum' the span that
        // holds the current direction number
        const directionNumEl = this.shadowRoot.getElementById('directNum');
        directionNumEl.innerText = startStepEl.innerText;
        // we get the actual direction <p> and we make sure to get the next instruction element on the left of
        // the current instruction element in the instructionsList arr remember that arr's first index = 0 but
        // our directions/steps start at 1 so we are 1 index ahead by startStep so we need to go back 2 times
        const directionEl = this.shadowRoot.getElementById('direction');
        directionEl.innerText = instructionsList[startStep - 2].step;
      } else {
        window.location.href = '../recipe_expand/recipe_expand.html#' + parsed.id;
      }
    });
    // the right button click updates the html page to show the next direction step and the corresponding step numbers
    // and direction numbers. It doesn't update anything if you are on the last step of already, end of the instructionlist arr
    const buttonRight = document.createElement('button');
    // this stuff below should make the button look nice
    buttonRight.innerHTML = `
    <span
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  </span>
    `;
    buttonRight.addEventListener('click', () => {
      // we have our list of instructions we want to know which step we are on so we know which new
      // instruction we should get
      const instructionsList = getInstructionSteps(parsed);
      // this sets startStepE1 pointed to the 'startStep' span number in the html page and parses the
      // inner number to be an int we also parse the Step 1/6 <- maxStep into an int 6
      const startStepEl = this.shadowRoot.getElementById('startStep');
      const startStep = parseInt(startStepEl.innerText);
      const maxStep = parseInt(
        this.shadowRoot.getElementById('maxStep').innerText
      );
      // we can only go forward if our start step doesn't look like this:6/6 where it is not less than maxStep
      if (startStep < maxStep) {
        // set the new 'startStep' through pointer startStepE1 to be += 1
        startStepEl.innerText = startStep + 1;
        // we also want the direction number to match the step number so we grab 'directNum' the span that
        // holds the current direction number
        const directionNumEl = this.shadowRoot.getElementById('directNum');
        directionNumEl.innerText = startStepEl.innerText;
        // we get the actual direction <p> and we make sure to get the next instruction element on the right of
        // the current instruction element in the instructionsList arr remember that arr's first index = 0 but
        // our directions/steps start at 1 so we are 1 index ahead by startStep so we just get the next instruction
        // at index startStep
        const directionEl = this.shadowRoot.getElementById('direction');
        directionEl.innerText = instructionsList[startStep].step;
      } else {
        window.location.href = '../recipe_expand/recipe_expand.html#' + parsed.id;
      }
    });
    // append buttons to navigate div
    navigate.appendChild(buttonLeft);
    navigate.appendChild(buttonRight);
    //#endregion  //*======== Navigate ===========
    // append everything to container div in order to populate html page
    container.appendChild(title);
    container.appendChild(step);
    container.appendChild(img);
    container.appendChild(directionContainer);
    container.appendChild(navigate);

    // Append the container to the shadowroot.
    this.shadowRoot.appendChild(styleElem);
    this.shadowRoot.appendChild(container);
  }
}

// Define the custom recipe expand container html element.
customElements.define('cook-view', CookView);
