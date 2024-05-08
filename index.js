/**
 * Name:    Daria Manguling, Heidi Wang
 * Date:    2024 05 05 Sun
 * Section: CSE 154 AG, Allison and Marina
 *
 * This is the index.html for all pages of the anime shopping site.
 */

/**
 * Name: Daria Manguling
 * Date: 5 May 2025
 * CSE 154 Section AG, Allison and Marina
 *
 * This is the product.js for specific interactivity on the product.html page.
 * Specifically, it allows a user to write reviews and post them on the product's page.
 * Manages view toggle and filtering for the page showing all items.
 */

/**
 * Name:    Heidi Wang
 * Date:    2024 05 05 Sun
 * Section: CSE 154 AG
 *
 * items.js
 * Manages view toggle and filtering for the page showing all items.
 */

'use strict';
(function() {
  window.addEventListener('load', init);

  /**
   * Daria Manguling
   * Initializes button to be able to write a review.
   */
  /**
   * Heidi Wang
   * Initializes the nav bar.
   * Initializes the filters.
   * Toggles between grid and list view.
   */
  function init() {
    const url = window.location.href;
    const page = url.split('#');
    if (page.length > 1) {
      goTo(page[1]);
    }
    const links = document.querySelectorAll('a');
    for (let i = 0; i < links.length; i++) {
      links[i].addEventListener('click', toggleScreens);
    }

    makeButton();

    document.getElementById('view').addEventListener('change', () => {
      const items = document.getElementById('items');
      items.classList.toggle('list-view');
    });

    let filters = document.querySelectorAll('input');
    for (let i = 0; i < filters.length; i++) {
      filters[i].addEventListener('change', filter);
    }
  }

  /**
   * Heidi Wang
   * Functionality for the nav bar to toggle between screens.
   */
  function toggleScreens() {
    // window.scroll(0, 300);
    const pages = document.querySelectorAll('main > section');
    for (let i = 0; i < pages.length; i++) {
      if (!pages[i].classList.contains('hidden')) {
        pages[i].classList.add('hidden');
      }
    }
    const page = this.href.split('#');
    document.getElementById(page[1]).classList.toggle('hidden');
  }

  /**
   * Heidi Wang
   * Functionality for going to the correct screen on load.
   */
  function goTo(screen) {
    // window.scroll(0, 300);
    const pages = document.querySelectorAll('main > section');
    for (let i = 0; i < pages.length; i++) {
      if (!pages[i].classList.contains('hidden')) {
        pages[i].classList.add('hidden');
      }
    }
    document.getElementById(screen).classList.toggle('hidden');
  }

  /**
   * Heidi Wang
   * Functionality for the filters.
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
   * Displays button that allows user to write a review on a product.
   */
  function makeButton() {
    let reviewButton = gen('button');
    reviewButton.textContent = 'Write a Review';
    id('reviews').appendChild(reviewButton);
    qs('#reviews button').addEventListener('click', writeReview);
  }

  /**
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