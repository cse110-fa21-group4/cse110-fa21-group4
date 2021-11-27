// Router.js

const funcs = {};
export class Router {
  /**
    * Sets up the home function, the page name should always be 'home', which
    * is why no page name variable is passed in.
    * @param {Function} homeFunc The function to run to set the home route
    *                            visually
    */
  constructor (homeFunc) {
    this.addPage('home', homeFunc);
  }

  /**
    * Adds a page name & function so to the router so that the function
    * can be called later when the page is passed in
    * @param {String} page The name of the page to route to (this is used
    *                      as the page's hash as well in the URL)
    * @param {Function} pageFunc The function to run when the page is called
    */
  addPage (page, pageFunc) {
    funcs[page] = pageFunc;
  }

  /**
    * Changes the page visually to the page that has been passed in. statePopped
    * is used to avoid pushing a new history state on back/forward button presses
    * @param {String} page The name of the page to route to
    * @param {Boolean} statePopped True if this function is being called from a
    *                              'popstate' event instead of a normal card click
    */
  navigate (page, statePopped) {
    if (funcs[page]) {
      funcs[page].call();
      if (!statePopped) {
        const address = (page === 'home') ? ' ' : (location.hash) + '#' + page;
        history.pushState({ page: page }, '', address);
      }
    }
  }
}
