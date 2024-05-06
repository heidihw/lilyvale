/**
 * Name: Daria Manguling
 * Date: 5 May 2025
 * CSE 154 Section AG, Allison and Marina
 *
 * This is the product.js for specific interactivity for the product.html page.
 * Specifically, it displays whatever product a user clicks on from the items.html.
 */
'use strict';
(function() {
  window.addEventListener('load', init);

  /**
   * Initializes button to be able to write a review.
   */
  function init() {
    makeButton();
  }

  /**
   *
   */
  function makeButton() {
    let reviewButton = gen('button');
    reviewButton.textContent = 'Write a Review';
    id('reviews').appendChild(reviewButton);
    qs('#reviews button').addEventListener('click', writeReview);
  }

  /**
   *
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
   *
   * @param {*} text
   * @param {*} content
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
   *
   */
  function postReview() {
    let container = gen('article');
    let ratingValue = id('rating').value;
    let descriptionText = id('description').value;
    let headerTitle = id('title').value;
    let header = gen('h3');
    header.textContent = headerTitle;
    let rating = gen('h4');
    rating.textContent = ratingValue + ' star(s)';
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
   *
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