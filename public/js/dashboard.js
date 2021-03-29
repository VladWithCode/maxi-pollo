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
    console.log(state);

    if (state.saleState) {
      saleStateDisplay.textContent = 'Habilitadas';
      saleStateDisplay.dataset['state'] = 'enabled';
      saleStateDisplay.classList.remove('state__value--u');
      saleStateDisplay.classList.add('state__value--a');
    } else {
      saleStateDisplay.textContent = 'Deshabilitadas';
      saleStateDisplay.dataset['state'] = 'disabled';
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
    this.classList.add('loading', 'noclick');
    this.classList.remove('state__value--a', 'state__value--u');
    let currentState = this.dataset.state;
    let res;

    try {
      res = await (
        await fetch('/api/sales', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
          body: JSON.stringify({ currentState }),
        })
      ).json();
      this.classList.remove('loading', 'noclick');
    } catch (err) {
      return console.log(err);
    }

    if (res.status !== 'OK') {
      handleFetchErrors(res);
    }

    if (res.newState) {
      this.textContent = 'Habilitadas';
      this.classList.add('state__value--a');
      this.dataset.state = 'enabled';
    } else {
      this.textContent = 'Deshabilitadas';
      this.classList.add('state__value--u');
      this.dataset.state = 'disabled';
    }
  });

  /* Meal & Sauce Availability Management */
  const stateTogglers = document.querySelectorAll('.av-toggler');

  stateTogglers.forEach((t) => {
    t.addEventListener('click', async function (e) {
      this.classList.add('loading', 'noclick');
      this.classList.remove('state__value--a', 'state__value--u');
      let { availability: isAvailable, id, type } = this.dataset;
      let res;
      const apiURI = `/api/${type === 'sauce' ? 'sauces' : 'meals'}/${id}`;

      try {
        res = await (
          await fetch(apiURI, {
            header: {
              'Content-Type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify({ isAvailable }),
          })
        ).json();
        this.classList.remove('loading', 'noclick');
      } catch (err) {
        return console.log(err);
      }

      if (res.status !== 'OK') {
        handleFetchErrors(res);
      }

      if (res.availability) {
        this.classList.add('state__value--a');
        this.dataset.availability = 'available';
      } else {
        this.classList.add('state__value--u');
        this.dataset.availability = 'unavailable';
      }
    });
  });
});
