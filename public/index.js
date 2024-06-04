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
   * Initializes the nav bar to switch between views.
   * Initializes the search feature in the nav bar.
   * Initializes the items view with the data for the items.
   * Initializes the toggle between grid and list layout in the items view.
   * Initializes the toggles to sort and filter in the items view.
   * Initializes the button to add an item to the cart.
   *
   * Daria Manguling
   * Initializes button to be able to write a review.
   */
  async function init() {
    // Heidi: Initializes the nav bar to switch between views.
    document.getElementById('title-index').addEventListener('click', toggleScreens);
    const links = document.querySelectorAll('nav p');
    for (let i = 0; i < links.length; i++) {
      links[i].addEventListener('click', toggleScreens);
    }

    // Heidi: Initializes the search feature in the nav bar.
    document.getElementById('search-term').addEventListener('input', enableSearch);
    document.getElementById('search-btn').addEventListener('click', makeSearch);

    // Heidi: Initializes the items view with the data for the items.
    await initItems();

    // Heidi: Initializes the toggle between grid and list layout in the items view.
    document.getElementById('layout').addEventListener('change', () => {
      document.getElementById('items-container').classList.toggle('grid-layout');
    });

    // Heidi: Initializes the toggles to sort and filter in the items view.
    document.getElementById('sort').addEventListener('change', await filterItems);
    let filters = document.querySelectorAll('section#filters-container input');
    for (let i = 0; i < filters.length; i++) {
      filters[i].addEventListener('change', await filterItems);
    }

    id('index-items-btn').addEventListener('click', viewAllItems);

    // Heidi: Initializes the figurines button on the index view.
    document.getElementById('index-figurines-btn').addEventListener('click', viewFigurines);

    // Heidi: Initializes the plushies button on the index view.
    document.getElementById('index-plushies-btn').addEventListener('click', viewPlushies);
    id('new-user-form').addEventListener('submit', makeNewUser);
    id('login-form').addEventListener('submit', loginUser);
    id('nav-logout').addEventListener('click', loggingOut);
    if (document.cookie.split('=')[1]) {
      loginView();
    } else {
      loggedOutView();
    }
    document.getElementById('confirm-transaction').addEventListener('click', toPurchaseView);
  }

  /**
   * When the user confirms purchase, this will display a message whether or not their
   * transaction was successful.
   */
  async function toPurchaseView() {
    toggleScreens.call(document.getElementById('nav-purchase'));
    let prodId = this.parentElement.parentElement.querySelector('article').id.split('-')[1];
    if (id('purchase-status')) {
      id('purchase-status').remove();
    }
    let banner = gen('section');
    banner.id = 'purchase-status';
    let goToItems = gen('button');
    goToItems.textContent = 'Back to items.';
    goToItems.addEventListener('click', () => {
      toggleScreens.call(document.getElementById('nav-items'));
    })
    banner.appendChild(goToItems);
    try {
      let params = new FormData();
      params.append('id', prodId);
      let makePurchase = await fetch('/purchase', {method: 'POST', body: params});
      await statusCheck(makePurchase);
      let res = await makePurchase.json();
      let successMessage = gen('p');
      successMessage.textContent = 'Your transaction was a success! Your confirmation' +
        ' number is: ' + res['pid'];
      banner.prepend(successMessage);
    } catch (err) {
      handlePuchaseError(err);
    }
    id('purchase').appendChild(banner);
  }

  /**
   * Displays an error message when a transaction doesn't go through.
   * @param {string} err - error message
   */
  function handlePuchaseError(err) {
    let errMessage = gen('p');
    errMessage.textContent = ':C Oh no! Transaction was NOT successful. ' + err;
    id('purchase-status').prepend(errMessage);
  }

  /**
   * Allows the user to see detailed information about a specific product as well as its
   * ratings.
   */
  async function viewProduct() {
    toggleScreens.call(document.getElementById('nav-product'));
    let prodId = this.parentElement.parentElement.id.split('-')[1];
    try {
      if (id('view-prod-err')) {
        id('view-prod-err').remove();
      }
      let fetchProdData = await fetch('items/' + prodId);
      await statusCheck(fetchProdData);
      let prodData = await fetchProdData.json();
      await makeProdCard(prodData);
      displayReviews(prodData);
      makeReviewForm();
    } catch (err) {
      let errMessage = gen('p');
      errMessage.id = 'view-prod-err';
      errMessage.textContent = 'Oh no! Try again later!';
      document.getElementById('product').appendChild(errMessage);
      id('view-prod-err').appendChild(errMessage);
    }
  }

  /**
   * Creates the card displaying specific product information for the website
   * @param {object} prodData - object containing detailed information about a specific
   *                            product
   */
  async function makeProdCard(prodData) {
    if (id('prod-listing')) {
      id('prod-listing').remove();
    }
    let prodListing = gen('section');
    prodListing.id = 'prod-listing';
    let prodImg = gen('img');
    prodImg.src = 'imgs/' + prodData['0']['src'];
    prodImg.alt = prodData['0']['name'];
    prodListing.appendChild(prodImg);
    let prodSection = gen('section');
    prodSection.id = 'item-' + prodData[0]['id'];
    prodListing.appendChild(prodSection);
    let prodNodes = makeProdInfo(prodData);
    prodSection.appendChild(prodNodes[0]);
    prodSection.appendChild(prodNodes[1]);
    prodSection.appendChild(prodNodes[2]);
    prodSection.appendChild(prodNodes[3]);
    prodSection.appendChild(prodNodes[4]);
    prodSection.appendChild(prodNodes[5]);
    id('product').appendChild(prodListing);
    if (document.cookie.split('=')[1]) {
      id('add-to-cart-btn').addEventListener('click', await fillCart);
    } else {
      id('add-to-cart-btn').addEventListener('click', () => {
        toggleScreens.call(document.getElementById('nav-login'));
      });
    }
  }

  /**
   * Creates the nodes needed to display the actual product information.
   * @param {object} prodData - object containing detailed information about a specific
   *                            product
   * @returns {array} Html nodes containing the actual data
   */
  function makeProdInfo(prodData) {
    let arrayProdInfoNodes = [];
    let prodTitle = gen('h1');
    prodTitle.textContent = prodData['0']['name'];
    let rating = gen('p');
    rating.textContent = prodData['0']['rating'] + ' star(s)';
    let price = gen('p');
    price.textContent = '$' + prodData[0]['price'];
    let addToCart = gen('button');
    addToCart.id = 'add-to-cart-btn';
    addToCart.textContent = "Add to Cart";
    let descTitle = gen('h2');
    descTitle.textContent = 'Description:';
    let desc = gen('p');
    desc.textContent = prodData[0]['desc'];
    arrayProdInfoNodes.push(prodTitle);
    arrayProdInfoNodes.push(rating);
    arrayProdInfoNodes.push(price);
    arrayProdInfoNodes.push(addToCart);
    arrayProdInfoNodes.push(descTitle);
    arrayProdInfoNodes.push(desc);
    return arrayProdInfoNodes;
  }

  /**
   * Displays all of the reviews for a given product/item.
   * @param {object} prodData - object containing detailed information about a specific
   *                             product
   */
  function displayReviews(prodData) {
    if (id('review-container')) {
      id('review-container').remove();
    }
    let reviewContainer = gen('article');
    reviewContainer.id = 'review-container';
    let reviewHeading = gen('h2');
    reviewHeading.textContent = 'Ratings';
    reviewContainer.appendChild(reviewHeading);
    let reviews = gen('section');
    reviews.id = 'review-list';
    for (let i = 0; i < prodData[1].length; i++) {
      let reviewCard = makeReviewCard(prodData[1][i]);
      reviews.appendChild(reviewCard);
    }
    reviewContainer.appendChild(reviews);
    id('product').appendChild(reviewContainer);
  }

  /**
   * Creates cards for an individual review.
   * @param {object} reviewInfo - object containing data about a specific review.
   * @returns {HTMLElement} section node containing parts of a review including title, rating,
   *                     name of user writing the review, and description.
   */
  function makeReviewCard(reviewInfo) {
    let reviewCard = gen('section');
    let title = gen('h3');
    title.textContent = reviewInfo['title'];
    let starRating;
    if (reviewInfo['rating'] === 1) {
      starRating = '1 star';
    } else {
      starRating = reviewInfo['rating'] + ' stars';
    }
    let ratingUser = gen('h4');
    ratingUser.textContent = starRating + ' from ' + reviewInfo['username'];
    let desc = gen('p');
    desc.textContent = reviewInfo['desc'];
    reviewCard.appendChild(title);
    reviewCard.appendChild(ratingUser);
    reviewCard.appendChild(desc);
    return reviewCard;
  }

  /**
   * Switches from main index view to item view when button is clicked.
   */
  function viewAllItems() {
    toggleScreens.call(document.getElementById('nav-items'));
    resetFilters();
    filterItems();
  }

  /**
   * Creates a new user on the website.
   * @param {object} evt - event object
   */
  async function makeNewUser(evt) {
    evt.preventDefault();
    let newUserData = new FormData(id('new-user-form'));
    try {
      if (id('register-err-message')) {
        id('register-err-message').remove();
      }
      let newUserDataForm = await fetch('create-user', {method: 'POST', body: newUserData});
      await statusCheck(newUserDataForm);
      await newUserDataForm.text();
      id('new-email').value = '';
      id('new-username').value = '';
      id('new-password').value = '';
      id('register').classList.toggle('hidden');
      id('login').classList.toggle('hidden');
    } catch (err) {
      let errMessage = gen('p');
      errMessage.id = 'register-err-message';
      errMessage.textContent = err;
      id('register').appendChild(errMessage);
    }
  }

  /**
   * Logs a user into the website.
   * @param {object} evt - event object
   */
  async function loginUser(evt) {
    evt.preventDefault();

    let userData = new FormData(id('login-form'));
    try {
      if (id('login-err-message')) {
        id('login-err-message').remove();
      }
      let userDataForm = await fetch('/login', {method: 'POST', body: userData});
      await statusCheck(userDataForm);
      await userDataForm.text();
      id('username-input').value = '';
      id('password-input').value = '';
      id('login').classList.add('hidden');
      loginView();
      await fillHistory();
    } catch (err) {
      let errMessage = gen('p');
      errMessage.id = 'login-err-message';
      errMessage.textContent = err;
      id('login').appendChild(errMessage);
    }
  }

  /**
   * What features the user see when they are logged in
   */
  function loginView() {
    id('nav-logout').classList.remove('hidden');
    id('nav-register').classList.add('hidden');
    id('nav-login').classList.add('hidden');
    id('nav-cart').classList.remove('hidden');
    id('nav-history').classList.remove('hidden');
    toggleScreens.call(document.getElementById('nav-index'));
  }

  /**
   * Logs a user out of the website
   */
  function loggingOut() {
    document.cookie = 'uid=';
    loggedOutView();
  }

  /**
   * What features the user sees if they are not logged into the website.
   */
  function loggedOutView() {
    id('nav-logout').classList.add('hidden');
    id('nav-register').classList.remove('hidden');
    id('nav-login').classList.remove('hidden');
    id('nav-cart').classList.add('hidden');
    id('nav-history').classList.add('hidden');
    toggleScreens.call(document.getElementById('nav-index'));
  }

  /**
   * Makes the form for being able to write reviews for a given product
   */
  function makeReviewForm() {
    let reviewFormContainer = gen('form');
    reviewFormContainer.id = 'review-form';
    id('review-container').appendChild(reviewFormContainer);
    makeTitleInput();
    makeRatingInput();
    makeDescInput();
    let completeReview = gen('button');
    completeReview.textContent = 'Post Review';
    id('review-form').appendChild(completeReview);
    reviewFormContainer.addEventListener('submit', postReview);
  }

  /**
   * Makes the title portion of the review form.
   */
  function makeTitleInput() {
    let divContainer = gen('div');
    let heading = createLabel('Title', 'title-input');
    let titleInput = gen('input');
    titleInput.id = 'title-input';
    titleInput.name = 'title';
    titleInput.type = 'text';
    titleInput.required = true;
    divContainer.appendChild(heading);
    divContainer.appendChild(titleInput);
    id('review-form').appendChild(divContainer);
  }

  /**
   *  Makes the numerical rating portion of the review form.
   */
  function makeRatingInput() {
    let divContainer = gen('div');
    let heading = createLabel('How many stars? Max 5', 'rating-input');
    let ratingInput = gen('input');
    ratingInput.id = 'rating-input';
    ratingInput.name = 'rating';
    ratingInput.type = 'number';
    ratingInput.min = 1;
    ratingInput.max = 5;
    ratingInput.required = true;
    divContainer.appendChild(heading);
    divContainer.appendChild(ratingInput);
    id('review-form').appendChild(divContainer);
  }

  /**
   * Makes the description portion of the review form.
   */
  function makeDescInput() {
    let divContainer = gen('div');
    let heading = createLabel('Describe your experience.', 'desc-input');
    let descInput = gen('textarea');
    descInput.id = 'desc-input';
    descInput.name = 'description';
    descInput.required = true;
    divContainer.appendChild(heading);
    divContainer.appendChild(descInput);
    id('review-form').appendChild(divContainer);
  }

  /**
   * When a review is made and meets all of the requirements for posting, it is
   * added to the database and the specific product/item's page.
   * @param {object} evt - event listener
   */
  async function postReview(evt) {
    evt.preventDefault();
    let params = new FormData(id('review-form'));
    let prodId = this.parentElement.parentElement.firstElementChild.lastElementChild.id;
    prodId = prodId.split('-')[1];
    params.append('id', prodId);
    try {
      if (id('review-form-err')) {
        id('review-form-err').remove();
      }
      let newReview = await fetch('/feedback', {method: 'POST', body: params});
      await statusCheck(newReview);
      let res = await newReview.json();
      let reviewCard = makeReviewCard(res);
      id('review-list').prepend(reviewCard);
    } catch (err) {
      let errMessage = gen('p');
      errMessage.id = 'review-form-err';
      errMessage.textContent = err;
      id('review-container').appendChild(errMessage);
    }
  }

  /**
   * Creates labels for the review form.
   * @param {string} text - header for the specific portion of the review form.
   * @param {string} content - signifies what part of the form a user is writing in.
   * @returns {HTMLElement} label element for a part of the review form
   */
  function createLabel(text, content) {
    let label = gen('label');
    label.textContent = text;
    label.htmlFor = content;
    return label;
  }

  /**
   * Heidi Wang
   * Initializes the nav bar to switch between views.
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
    if (view === 'items') {
      resetFilters();
      filterItems();
    }
    window.scroll(0, 0);
  }

  /**
   * Heidi Wang
   * Enables and disables the search button based on the search term input value in the search bar.
   * Leading and trailing whitespace is not considered as valid search input.
   */
  function enableSearch() {
    if (this.value.trim().length > 0) {
      document.getElementById('search-btn').disabled = false;
    } else {
      document.getElementById('search-btn').disabled = true;
    }
  }

  /**
   * Heidi Wang
   * Searches the items for the given search term. Displays only the matching items.
   */
  function makeSearch() {
    toggleScreens.call(document.getElementById('nav-items'));
    let searchTerm = document.getElementById('search-term').value.trim();
    fillFilteredItems(searchTerm, '');
  }

  /**
   * Heidi Wang
   * Populates the items list with the items for sale.
   */
  async function initItems() {
    try {
      let res = await fetch('/items');
      await statusCheck(res);
      res = await res.json();

      let container = document.getElementById('items-container');
      container.innerHTML = '';
      for (let i = 0; i < res.length; i++) {
        if (res[i]['quantity'] > 0) {
          let item = fillItem(res[i]);
          let rating = document.createElement('p');
          rating.textContent = res[i]['rating'] + ' stars';
          item.querySelector('div.text').appendChild(rating);
          container.appendChild(item);
        }
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
    container.id = 'item-' + res['id'];

    let imgDiv = document.createElement('div');
    imgDiv.classList.add('img');
    let img = document.createElement('img');
    img.src = 'imgs/' + res['src'];
    img.alt = res['name'];
    imgDiv.appendChild(img);
    container.appendChild(imgDiv);

    let text = document.createElement('div');
    text.classList.add('text');
    let name = document.createElement('p');
    name.classList.add('listing-link');
    name.textContent = res['name'];
    name.addEventListener('click', viewProduct);
    text.appendChild(name);
    let price = document.createElement('p');
    price.textContent = '$' + res['price'];
    text.appendChild(price);
    container.appendChild(text);

    let tags = document.createElement('p');
    tags.textContent = res['tags'];
    tags.classList.add('hidden');
    container.appendChild(tags);

    return container;
  }

  /**
   * Heidi Wang
   * Filters all the items for the ones that are in the selected categories.
   * Includes sorting the results in the selected order.
   */
  async function filterItems() {
    let filters = document.querySelectorAll('input');
    let search = '';
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].checked) {
        search += filters[i].name + ' ';
      }
    }
    search = search.trim();
    let sort = document.getElementById('sort');
    let order = sort.options[sort.selectedIndex].value;
    await fillFilteredItems(search, order);
  }

  /**
   * Heidi Wang
   * Makes the API call to filter and sort the selected items.
   * @param {string} search - the search by which to filter the items
   * @param {string} order - the order in which to display the items
   */
  async function fillFilteredItems(search, order) {
    try {
      let res = await fetch('/items?search=' + search + '&order=' + order);
      await statusCheck(res);
      res = await res.json();

      let itemsContainer = document.getElementById('items-container');
      itemsContainer.innerHTML = '';
      for (let i = 0; i < res.length; i++) {
        itemsContainer.appendChild(fillItem(res[i]));
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Heidi Wang
   * Populates the cart with the item in the cart.
   */
  async function fillCart() {
    try {
      let id = this.parentElement.id.split('-')[1];
      let res = await fetch('/items/' + id);
      await statusCheck(res);
      res = await res.json();

      document.getElementById('product').classList.add('hidden');
      document.getElementById('cart').classList.remove('hidden');
      let container = document.getElementById('cart-container');
      container.innerHTML = '';
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
   */
  async function fillHistory() {
    try {
      let res = await fetch('/history');
      await statusCheck(res);
      res = await res.json();

      let container = document.getElementById('history-container');
      container.innerHTML = '';
      let count = document.querySelector('section#history > div p span');
      count.textContent = res[0].length;
      for (let i = 0; i < res[0].length; i++) {
        let item = fillItem(res[1][i]);
        let time = document.createElement('p');
        time.textContent = 'Time: ' + res[0][i]['time'];
        let id = document.createElement('p');
        id.textContent = 'Confirmation number: ' + res[0][i]['pid'];
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
   * Resets the filters on the items view to be all unchecked.
   */
  function resetFilters() {
    let filters = document.querySelectorAll('section#filters-container input');
    for (let i = 0; i < filters.length; i++) {
      filters[i].checked = false;
    }
  }

  /**
   * Heidi Wang
   * Initializes the figurines button on the index view.
   */
  function viewFigurines() {
    toggleScreens.call(document.getElementById('nav-items'));
    resetFilters();
    document.getElementById('figurine').checked = true;
    filterItems();
  }

  /**
   * Heidi Wang
   * Initializes the plushies button on the index view.
   */
  function viewPlushies() {
    toggleScreens.call(document.getElementById('nav-items'));
    resetFilters();
    document.getElementById('plush').checked = true;
    filterItems();
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

})();
