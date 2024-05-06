/**
 * Name:    Heidi Wang
 * Date:    2024 05 05 Sun
 * Section: CSE 154 AG
 *
 * items.js interactions specific to items.html
 * pt.1-1
 */

'use strict';
(function() {
  window.addEventListener('load', init);

  function init() {
    document.getElementById('view').addEventListener('change', () => {
      const items = document.getElementById('items');
      items.classList.toggle('list-view');
      console.log(items.classList);
    });
  }

})();
