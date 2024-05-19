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

    document.getElementById('cart-container').addEventListener(popCart);
    document.getElementById('history-container').addEventListener(popHistory);
    document.getElementById('filters-container').addEventListener(popFilters);
    document.getElementById('items-container').addEventListener(popItems);
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
    document.getElementById(page).classList.toggle('hidden');
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
   * Populates the cart with the items in the cart.
   */
  function popCart() {

  // <article>
  //   <div class="img">
  //     <img src="../imgs/img-src.jpeg" alt="item img">
  //   </div>
  //   <div class="text">
  //     <p><a href="index.html#product">item name</a></p>
  //     <p>$<span>item price</span></p>
  //   </div>
  // </article>
  }

  /**
   * Heidi Wang
   * Populates the purchase history with the items purchased.
   */
  function popHistory() {

  // <article>
  //   <div class="order">
  //     <p>Time: 2024/03/12 Fri 18:23 pm</p>
  //     <p>Confirmation number: 1726598578</p>
  //   </div>
  //   <div class="item">
  //     <div class="img">
  //       <img src="../imgs/rezero-rem-figurine.jpeg" alt="Taiga">
  //     </div>
  //     <div class="text">
  //       <p><a href="index.html#product">Toradora Taiga Plush</a></p>
  //       <p>$25</p>
  //     </div>
  //   </div>
  // </article>
  }

  /**
   * Heidi Wang
   * Populates the filters to filter the items for sale.
   */
  function popFilters() {
    popType();
    popFranchise();
  // <div id="filters-type-container">
  //   <p>Item Type:</p>
  //   <input type="checkbox" id="plush" name="plush">
  //   <label for="plush">Plush</label><br>
  //   <input type="checkbox" id="pin" name="pin">
  //   <label for="pin">Pin</label><br>
  //   <input type="checkbox" id="keychain" name="keychain">
  //   <label for="keychain">Keychain</label><br>
  //   <input type="checkbox" id="poster" name="poster">
  //   <label for="poster">Poster</label><br>
  //   <input type="checkbox" id="standee" name="standee">
  //   <label for="standee">Standee</label><br>
  // </div>
  // <div id="filters-franchise-container">
  //   <p>Franchise:</p>
  //   <input type="checkbox" id="toradora" name="toradora">
  //   <label for="toradora">Toradora</label><br>
  //   <input type="checkbox" id="re-zero" name="re-zero">
  //   <label for="re-zero">Re:Zero</label><br>
  //   <input type="checkbox" id="fate-stay-night" name="fate-stay-night">
  //   <label for="fate-stay-night">Fate/Stay Night</label><br>
  // </div>
  }

  /**
   * Heidi Wang
   * Populates the items list with the items for sale.
   */
  function popItems() {


  // <article>
  //   <div class="img">
  //     <img src="../imgs/xie-lian-nendoroid.jpeg" alt="Taiga">
  //   </div>
  //   <div class="text">
  //     <a href="index.html#product" class="listing-link">Toradora Taiga Plush</a>
  //     <div class="line">
  //       <p>$25</p>
  //       <p>5 stars</p>
  //     </div>
  //   </div>
  // </article>
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
