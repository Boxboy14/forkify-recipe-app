import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }
const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

//   // API
// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlRecipes = async function () {
  // an async function runs in the background without blocking the main thread
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    //   rendering the spinner
    recipeView.renderSpinner();
    // 0. Update the results view to mark the selected search result
    resultsView.update(model.controlSearchResultsPage());
    // 3. Update the bookmarks
    bookmarksView.update(model.state.bookmarks);
    //   1. Loading the recipe
    await model.loadRecipe(id);

    // 2. Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //2. Get search results
    await model.loadSearchResults(query);
    // 3. Rendering the results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.controlSearchResultsPage());

    // 4. Render the initial pagination efforts
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render the NEW results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.controlSearchResultsPage(goToPage));

  // 2. Render the NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // uopdate the recipe servings in the state
  model.updateServings(newServings);
  // update the recipe view
  //   recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. Add the bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  // 2. Update recipe vew
  recipeView.update(model.state.recipe);
  // 3. Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    //   console.log(newRecipe);
    // Upload a new Recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render the uploaded recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render the bookmarksView
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // this method takes 3 arguments , 1st is the state which does not really matter , 2nd is the title which in this case can be left blank '' , 3rd is the url

    // CLose the form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('✨', err);
    addRecipeView.renderError(err.message);
  }
};
const newFeature = function () {
  console.log('New feature added!');
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
