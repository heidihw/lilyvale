/**
 * Name:    Heidi Wang
 * Date:    2024 05 05 Sun
 * Section: CSE 154 AG
 *
 * Manages view toggle and filtering for the page showing all items.
 *
 */

'use strict';
(function() {
  window.addEventListener('load', init);

  /**
   * Initializes the filters.
   * Toggles between grid and list view.
   */
  function init() {
    document.getElementById('view').addEventListener('change', () => {
      const items = document.getElementById('items');
      items.classList.toggle('list-view');
      console.log(items.classList);
    });

    let filters = document.querySelectorAll('input')
    for (let i = 0; i < filters.length; i++) {
      filters[i].addEventListener('change', filter);
    }
  }

  /**
   * Functionality for the filters.
   */
  function filter() {
    console.log('cry');
  }

})();
