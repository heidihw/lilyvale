/**
 * Name:    Daria Manguling, Heidi Wang
 * Date:    2024 05 05 Sun
 * Section: CSE 154 AG, Allison and Marina
 *
 * This is the index.js for all views of the anime shopping site.
 * It allows a user to write reviews and post them on the product view.
 * Manages layout toggle and filtering for the view showing all items.
 */

'use strict';

(function() {
  window.addEventListener('load', init);

  /**
   * Heidi Wang
   * Fills the page on load with the initial data from the API.
   * Initializes the nav bar to switch between views.
   * Initializes the toggle between grid and list layout in the items view.
   *
   * Daria Manguling
   * Initializes button to be able to write a review.
   */
  function init() {
    /** Heidi */

    // Initializes the nav bar to switch between views.
    document.getElementById('title-index').addEventListener('click', toggleScreens);
    const links = document.querySelectorAll('nav p');
    for (let i = 0; i < links.length; i++) {
      links[i].addEventListener('click', toggleScreens);
    }

    // Fills the page on load with the initial data from the API.
    /**
     * TODO: Daria: write functions to init the other 5 views as needed and call them here
     * index login register purchase product
     * (the first 3 probably don't need it so probably just the latter 2)
     */
    initCart();
    document.getElementById('login-form').addEventListener('submit', initHistory);
    initItems();

    // Initializes the toggle between grid and list layout in the items view.
    document.getElementById('layout').addEventListener('change', () => {
      document.getElementById('items-container').classList.toggle('grid-layout');
    });

    // add item to cart
    document.getElementById('add-to-cart-btn').addEventListener('click', fillCart);

    /** Daria */
    id('index-items-btn').addEventListener('click', indexToItems);
    id('new-user-form').addEventListener('submit', makeNewUser);
  }

  function indexToItems() {
    id('index').classList.toggle('hidden');
    id('items').classList.toggle('hidden');
  }

  async function makeNewUser(evt) {
    evt.preventDefault();
    let newUserData = new FormData(id('new-user-form'));
    try {
      let newUserDataForm = await fetch('create-user', {method: 'POST', body: newUserData});
      await statusCheck(newUserDataForm);
      await newUserDataForm.text();
      id('new-email').value = '';
      id('new-username').value = '';
      id('new-password').value = '';
      id('register').classList.toggle('hidden');
      id('login').classList.toggle('hidden');
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Heidi Wang
   * For the nav bar. Toggles between page views.
   */
  function toggleScreens() {
    const pages = document.querySelectorAll('main > section');
    for (let i = 0; i < pages.length; i++) {
      if (!pages[i].classList.contains('hidden')) {
        pages[i].classList.add('hidden');
      }
    }
    const view = this.id.split('-')[1];
    document.getElementById(view).classList.remove('hidden');
    window.scroll(0, 0);
  }

  /**
   * Heidi Wang
   * Populates the cart with a message indicating it is empty.
   */
  function initCart() {
    let container = document.getElementById('cart-container');
    let empty = document.createElement('p');
    empty.textContent = 'Your cart is empty';
    container.appendChild(empty);
    document.querySelector('section#cart > div').classList.add('hidden');
    document.getElementById('confirm-transaction').classList.add('hidden');
  }

  /**
   * Heidi Wang
   * Populates the cart with the item in the cart.
   */
  async function fillCart() {
    document.getElementById('product').classList.add('hidden');
    document.getElementById('cart').classList.remove('hidden');
    let container = document.getElementById('cart-container');
    container.innerHTML = '';
    let id = this.parentElement.parentElement.querySelector('img').id.split('-')[1];
    try {
      let res = await fetch('/items/' + id);
      await statusCheck(res);
      res = await res.json();

      let item = fillItem(res[0]);
      container.appendChild(item);
      document.querySelector('section#cart > div').classList.remove('hidden');
      document.getElementById('confirm-transaction').classList.remove('hidden');
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Heidi Wang
   * Populates the purchase history with the items purchased.
   * @param {Event} evt - the form submission event. automatically passed with the function call.
   */
  async function initHistory(evt) {
    evt.preventDefault();
    let container = document.getElementById('history-container');
    container.innerHTML = '';
    try {
      let res = await fetch('/history');
      await statusCheck(res);
      res = await res.json();

      let items = await fetch('/items');
      await statusCheck(items);
      items = await items.json();

      let count = document.querySelector('section#history > div p span');
      count.textContent = res.length;
      for (let i = 0; i < res.length; i++) {
        let item = fillItem(items[res[i]['item'] - 1]);
        let time = document.createElement('p');
        time.textContent = 'Time: ' + res[i]['time'];
        let id = document.createElement('p');
        id.textContent = 'Confirmation number: ' + res[i]['id'];
        item.querySelector('div.text').appendChild(time);
        item.querySelector('div.text').appendChild(id);
        container.appendChild(item);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Heidi Wang
   * Populates the items list with the items for sale.
   * Populates the filters to filter the items for sale.
   * Initializes the filters to display only the items that are in the selected categories.
   */
  async function initItems() {
    let container = document.getElementById('items-container');
    container.innerHTML = '';
    try {
      let res = await fetch('/items');
      await statusCheck(res);
      res = await res.json();

      for (let i = 0; i < res.length; i++) {
        if (res[i].count > 0) {
          let item = fillItem(res[i]);
          let rating = document.createElement('p');
          rating.textContent = res[i]['rating'] + ' stars';
          item.querySelector('div.text').appendChild(rating);
          container.appendChild(item);
        }
      }
      await fillFilters();

      // currently filtering with css classes; later should be done through API call instead
      let filters = document.querySelectorAll('input');
      for (let i = 0; i < filters.length; i++) {
        filters[i].addEventListener('change', filterItems);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Heidi Wang
   * Populates an article DOM element with formatted data for a singular given item.
   * @param {JSON} res - the data from the API call for the given item.
   * @returns {HTMLElement} the formatted article DOM element.
   */
  function fillItem(res) {
    let container = document.createElement('article');
    for (const filter in res['filters']) {
      container.classList.add(res['filters'][filter]);
    }
    let imgDiv = document.createElement('div');
    imgDiv.classList.add('img');
    let img = document.createElement('img');
    img.src = res['img-src'];
    img.alt = res['name'];
    imgDiv.appendChild(img);
    container.appendChild(imgDiv);
    let text = document.createElement('div');
    text.classList.add('text');
    let name = document.createElement('p');
    let link = document.createElement('a');
    link.classList.add('listing-link');
    link.href = 'index.html#product';
    link.textContent = res['name'];
    name.appendChild(link);
    text.appendChild(name);
    let price = document.createElement('p');
    price.textContent = '$' + res['price'];
    text.appendChild(price);
    container.appendChild(text);
    return container;
  }

  /**
   * Heidi Wang
   * Populates the filters to filter the items for sale.
   */
  async function fillFilters() {
    let container = document.getElementById('filters-container');
    container.innerHTML = '';
    try {
      let res = await fetch('/search');
      await statusCheck(res);
      res = await res.json();

      let heading3 = document.createElement('h3');
      heading3.textContent = 'Filters';
      container.appendChild(heading3);

      let types = fillFilterDiv('type', 'Type', res);
      container.appendChild(types);
      let franchises = fillFilterDiv('franchise', 'Franchise', res);
      container.appendChild(franchises);
      let prices = fillFilterDiv('price', 'Price', res);
      container.appendChild(prices);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Heidi Wang
   * Populates a div DOM element with formatted data for a category of filters.
   * @param {string} id - the id of the filter category.
   * @param {string} name - the name of the filter category.
   * @param {JSON} res - the data for all the filters.
   * @returns {HTMLDivElement} the formatted filter category.
   */
  function fillFilterDiv(id, name, res) {
    let div = document.createElement('div');
    div.id = 'filters-' + id + '-container';
    let divName = document.createElement('p');
    divName.textContent = name + ':';
    div.appendChild(divName);
    for (let i = 0; i < res[id].length; i++) {
      let filter = fillFilter(res[id][i]);
      div.appendChild(filter);
    }
    return div;
  }

  /**
   * Heidi Wang
   * Populates a div DOM element with formatted data for a singular given filter.
   * @param {JSON} res - the data from the API call for the given filter.
   * @returns {HTMLDivElement} the formatted div DOM element.
   */
  function fillFilter(res) {
    let div = document.createElement('div');
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.id = res['id'];
    input.name = res['id'];
    div.appendChild(input);
    let label = document.createElement('label');
    label.htmlFor = res['id'];
    label.textContent = res['name'];
    div.appendChild(label);
    return div;
  }

  /**
   * Heidi Wang
   * Filters all the items for the ones that are in the selected categories.
   */
  function filterItems() {
    let cleared = true;
    let filters = document.querySelectorAll('input');
    let selected = [];
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].checked) {
        selected.push(filters[i]);
        cleared = false;
      }
    }
    let items = document.querySelectorAll('article');
    if (cleared) {
      for (let i = 0; i < items.length; i++) {
        items[i].style.display = 'unset';
      }
    } else {
      for (let i = 0; i < items.length; i++) {
        items[i].style.display = 'none';
        for (let j = 0; j < selected.length; j++) {
          if (items[i].classList.contains(selected[j].id)) {
            items[i].style.display = 'unset';
          }
        }
      }
    }
  }

  /**
   * Daria Manguling
   * Displays button that allows user to write a review on a product.
   */
  function makeButton() {
    let reviewButton = gen('button');
    reviewButton.textContent = 'Write a Review';
    id('reviews').appendChild(reviewButton);
    qs('#reviews button').addEventListener('click', writeReview);
  }

  /**
   * Daria Manguling
   * Displays form for the user to write a review for a product.
   */
  function writeReview() {
    qs('#reviews button').parentNode.removeChild(qs('#reviews button'));
    let reviewContainer = gen('section');
    reviewContainer.id = 'write-review';
    id('reviews').appendChild(reviewContainer);
    createLabelInput('Title', 'title');
    createLabelInput('How many stars? Max 5', 'rating');
    createLabelInput('Describe your experience.', 'description');
    let completeReview = gen('button');
    completeReview.textContent = 'Post Review';
    id('write-review').appendChild(completeReview);
    completeReview.addEventListener('click', postReview);
  }

  /**
   * Daria Manguling
   * Creates a portion of what will be part of the form to write a review.
   * @param {string} text - header for the specific portion of the review form.
   * @param {string} content - signifies what part of the form a user is writing in.
   */
  function createLabelInput(text, content) {
    let label = gen('label');
    label.textContent = text;
    label.htmlFor = content;
    id('write-review').appendChild(label);
    let formInput = gen('input');
    formInput.id = content;
    formInput.type = 'text';
    id('write-review').appendChild(formInput);
  }

  /**
   * Daria Manguling
   * Taking in user input from the write-a-review form, posts the user's review among the
   * list of reviews for the product they reviewed.
   */
  function postReview() {
    let container = gen('article');
    let ratingValue = id('rating').value;
    let descriptionText = id('description').value;
    let headerTitle = id('title').value;
    let header = gen('h3');
    header.textContent = headerTitle;
    let rating = gen('h4');
    rating.textContent = ratingValue + ' Star(s)';
    let description = gen('p');
    description.textContent = descriptionText;
    container.appendChild(header);
    container.appendChild(rating);
    container.appendChild(description);
    id('reviews').appendChild(container);
    id('write-review').parentNode.removeChild(id('write-review'));
    makeButton();
  }

  // standard functions

  /**
   * Checks the status of the given Response and throws an error if the status is not ok.
   * @param {Response} res - the given Response of which to check the status.
   * @returns {Response} given as the parameter.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Finds the element with the specified ID attribute.
   * @param {string} id - element ID
   * @returns {HTMLElement} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Generates an HTML element based on given tag name.
   * @param {string} tag - HTML tag
   * @returns {HTMLElement} DOM object with specified HTML tag.
   */
  function gen(tag) {
    return document.createElement(tag);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }
})();
