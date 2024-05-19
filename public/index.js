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
   * Daria Manguling
   * Initializes button to be able to write a review.
   *
   * Heidi Wang
   * Initializes the nav bar to switch between views.
   * Toggles between grid and list layout in the items view.
   * Initializes the filters to display only the items that are in the selected categories.
   * Fills the filters, items, cart, and history appropriately with data from the API.
   */
  function init() {
    /** Heidi */
    const currUrl = window.location.href;
    const splitUrl = currUrl.split('#');
    if (splitUrl.length > 1) {
      goTo(splitUrl[1]);
    }
    const links = document.querySelectorAll('a');
    for (let i = 0; i < links.length; i++) {
      links[i].addEventListener('click', toggleScreens);
    }

    /** Daria */
    makeButton();

    /** Heidi */
    document.getElementById('view').addEventListener('change', () => {
      const items = document.getElementById('items');
      items.classList.toggle('list-view');
    });

    let filters = document.querySelectorAll('input');
    for (let i = 0; i < filters.length; i++) {
      filters[i].addEventListener('change', filter);
    }

    fillData();
  }

  /**
   * Heidi Wang
   * For the nav bar. Toggles between views.
   */
  function toggleScreens() {
    const pages = document.querySelectorAll('main > section');
    for (let i = 0; i < pages.length; i++) {
      if (!pages[i].classList.contains('hidden')) {
        pages[i].classList.add('hidden');
      }
    }
    const splitUrl = this.href.split('#');
    document.getElementById(splitUrl[1]).classList.toggle('hidden');
    window.scroll(0, 0);
  }

  /**
   * Heidi Wang
   * Goes to the correct view on page load.
   */
  function goTo(page) {
    const pages = document.querySelectorAll('main > section');
    for (let i = 0; i < pages.length; i++) {
      if (!pages[i].classList.contains('hidden')) {
        pages[i].classList.add('hidden');
      }
    }
    document.getElementById(page).classList.remove('hidden');
    window.scroll(0, 0);
  }

  /**
   * Heidi Wang
   * Filters all the items for the ones that are in the selected categories.
   */
  function filter() {
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
   * Heidi Wang
   * Fills the filters, items, cart, and history appropriately with data from the API.
   */
  async function fillData() {
    try {
      let res = await fetch('/get');
      await statusCheck(res);
      res = await res.json();

      fillCart(res);
      fillHistory(res);
      fillItems(res);
      fillFilters(res);
    } catch (err) {
      handleError(err, container);
    }
  }

  /**
   * Heidi Wang
   * Populates the cart with the items in the cart.
   * @param {JSON} res - the data from the API call.
   */
  function fillCart(res) {
    let container = document.getElementById('cart-container');
    container.innerHTML = '';
    for (let i = 0; i < res.items.length; i++) {
      if (res.items[i]['purchase-status'] === 'cart') {
        let item = fillItem(res.items[i]);
        container.appendChild(item);
      }
    }
  }

  /**
   * Heidi Wang
   * Populates the purchase history with the items purchased.
   * @param {JSON} res - the data from the API call.
   */
  function fillHistory(res) {
    let container = document.getElementById('history-container');
    container.innerHTML = '';
    for (let i = 0; i < res.history.length; i++) {
      let order = document.createElement('article');
      let orderData = document.createElement('div');
      orderData.classList.add('order');
      let time = document.createElement('p');
      time.textContent = 'Time: ' + res.history[i].time;
      let id = document.createElement('p');
      id.textContent = 'Confirmation number: ' + res.history[i].id;
      orderData.appendChild(time);
      orderData.appendChild(id);
      order.appendChild(orderData);
      let item = fillItem(res.items[res.history[i].item - 1]);
      order.appendChild(item);
      container.appendChild(order);
    }
  }

  /**
   * Heidi Wang
   * Populates the items list with the items for sale.
   * @param {JSON} res - the data from the API call.
   */
  function fillItems(res) {
    let container = document.getElementById('items-container');
    container.innerHTML = '';
    for (let i = 0; i < res.items.length; i++) {
      let item = fillItem(res.items[i]);
      container.appendChild(item);
    }
  }

  /**
   * Heidi Wang
   * Populates the filters to filter the items for sale.
   * @param {JSON} res - the data from the API call.
   */
  function fillFilters(res) {
    let container = document.getElementById('filters-container');
    container.innerHTML = '';
    let heading3 = document.createElement('h3');
    heading3.textContent = 'Filters';
    container.appendChild(heading3);

    let types = fillFilterDiv('types', 'Type', res.filters);
    container.appendChild(types);
    let franchises = fillFilterDiv('franchises', 'Franchise', res.filters);
    container.appendChild(franchises);
    let prices = fillFilterDiv('prices', 'Price', res.filters);
    container.appendChild(prices);
  }

  function fillFilterDiv(id, name, filters) {
    let div = document.createElement('div');
    div.id = 'filters-' + id + '-container';
    let divName = document.createElement('p');
    divName.textContent = name + ':';
    div.appendChild(divName);
    for (let i = 0; i < filters[id].length; i++) {
      let filter = fillFilter(filters[id][i]);
      div.appendChild(filter);
    }
    return div;
  }

  /**
   * Heidi Wang
   * Populates a div DOM element with formatted data for a singular given filter.
   * @param {JSON} filter - the data from the API call for the given filter.
   * @returns the formatted div DOM element.
   */
  function fillFilter(filter) {
    let div = document.createElement('div');
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.id = filter.id;
    input.name = filter.id;
    div.appendChild(input);
    let label = document.createElement('label');
    label.for = filter.id;
    label.textContent = filter.name;
    div.appendChild(label);
    return div;
  }

  /**
   * Heidi Wang
   * Populates an article DOM element with formatted data for a singular given item.
   * @param {JSON} item - the data from the API call for the given item.
   * @returns the formatted article DOM element.
   */
  function fillItem(item) {
    let container = document.createElement('article');
    container.classList.add(item.filters.type);
    container.classList.add(item.filters.franchise);
    container.classList.add(item.filters.price);
    let imgDiv = document.createElement('div');
    imgDiv.classList.add('img');
    let img = document.createElement('img');
    img.src = item['img-src'];
    img.alt = item.name;
    imgDiv.appendChild(img);
    container.appendChild(imgDiv);
    let text = document.createElement('div');
    text.classList.add('text');
    let name = document.createElement('p');
    let link = document.createElement('a');
    link.classList.add('listing-link');
    link.href = 'index.html#product';
    link.textContent = item.name;
    name.appendChild(link);
    text.appendChild(name);
    let price = document.createElement('p');
    price.textContent = '$' + item.price;
    text.appendChild(price);
    let rating = document.createElement('p');
    rating.textContent = item.rating + ' stars';
    text.appendChild(rating);
    container.appendChild(text);
    return container;
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
   * Updates the DOM to display the message in the given error.
   * @param {exception} err - the contents of the error.
   * @param {HTMLElement} container - the DOM element within which to display the error message.
   */
  function handleError(err, container) {
    let errMsg = document.createElement('p');
    errMsg.textContent = err.message;
    container.appendChild(errMsg);
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
