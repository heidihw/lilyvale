/**
 * Name: Daria Manguling
 * Date: 5 May 2025
 * CSE 154 Section AG, Allison and Marina
 *
 * This is the product.js for specific interactivity for the product.html page.
 * Specifically, it displays whatever product a user clicks on from the list.html.
 */
'use strict';
(function() {

  // img, price, rating, desc, alt will be key, description will be fake latin text
  window.addEventListener('load', init);

  function init() {
    id('review-button').addEventListener('click', writeReview);
  }

  function writeReview() {
    this.classList.toggle('hidden');
    let ratingPrompt = gen('h3');
    ratingPrompt.textContent = 'How many stars? Max 5';
    id('reviews').appendChild(ratingPrompt);
    let describePrompt = gen('h3');
    describePrompt.textContent = 'Describe your experience.'
    id('reviews').appendChild(describePrompt);
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
})();