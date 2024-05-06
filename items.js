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
    });

    let filters = document.querySelectorAll('input');
    for (let i = 0; i < filters.length; i++) {
      filters[i].addEventListener('change', filter);
    }
  }

  /**
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

})();
