import { generateStateValueHTML, handleFetchErrors } from './helpers/help.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Declare initial state for sales, sauces & meals
  const state = {
    salesSate: false,
    saucesState: [],
    mealsState: [],
  };

  // Globally used DOM Elements
  const saleStateDisplay = document.getElementById('saleStateDisplay');
  const sauceList = document.getElementById('sauceList');
  const mealList = document.getElementById('mealList');

  // Current Status fetching
  /**
   * Fetch the current status of either sales,
   *  sauces or meals (Or all of them if none specified).
   *
   * @param {'sales' | 'sauces' | 'meals'} [type] - The type of state to fetch
   *
   * @returns {Promise<any>}
   */
  const fetchState = async (type) => {
    let fetchQueryString = '/api/state';
    if (type) fetchQueryString += `?type=${type}`;

    const response = await (await fetch(fetchQueryString)).json();

    switch (response.status) {
      case 'OK':
        return response;
      default:
        return handleFetchErrors(response);
    }
  };

  /* Initial state check and rendering */
  await (async function () {
    const { state } = await fetchState();
    // console.log(state);

    if (state.saleState) {
      saleStateDisplay.textContent = 'Habilitadas';
      saleStateDisplay.classList.remove('state__value--u');
      saleStateDisplay.classList.add('state__value--a');
    } else {
      saleStateDisplay.textContent = 'Deshabilitadas';
      saleStateDisplay.classList.remove('state__value--a');
      saleStateDisplay.classList.add('state__value--u');
    }

    state.mealState?.length &&
      state.mealState.forEach((meal) => {
        mealList.insertAdjacentHTML('beforeend', generateStateValueHTML(meal));
      });

    state.sauceState?.length &&
      state.sauceState.forEach((sauce) => {
        sauceList.insertAdjacentHTML(
          'beforeend',
          generateStateValueHTML(sauce)
        );
      });
  })();

  /* Sale State Management */
  saleStateDisplay.addEventListener('click', async function (e) {
    this.classList.add('loading');

    setTimeout(() => this.classList.remove('loading'), 2000);
  });
});
