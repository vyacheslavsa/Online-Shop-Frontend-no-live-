const allCategory = document.querySelectorAll(".side_bar");
const allTabs = document.querySelectorAll(".modal_window__tabs_panel");
const productsBoard = document.querySelector(".products_board");
const modalWindow = document.querySelector(".modal_bg");
const buttonCloseModal = document.querySelector(".modal_window__close_button");
const headerModalText = document.querySelector(".modal_window__head_text");
const modalIngredients = document.querySelector(".modal_window__ingredients");
const modalPrice = document.querySelector(".modal_price");
const tabsModal = document.querySelectorAll(".modal_window__tab");
const footerModal = document.querySelector(".modal_window__footer");
const bottomFooter = document.querySelector(".modal_window__bottomFooter");

const ALL_CATEGORIES = {
  breads: "breads",
  fillings: "fillings",
  sauces: "sauces",
  sizes: "sizes",
  vegetables: "vegetables",
};

const allObjData = [
  ALL_CATEGORIES.breads,
  ALL_CATEGORIES.fillings,
  ALL_CATEGORIES.sauces,
  ALL_CATEGORIES.sizes,
  ALL_CATEGORIES.vegetables,
];

const customSandwich = {};
const shopingCart = [];

const addIDforData = () => {
  const generateID = () =>
    String(Math.round(Math.random() * 10000000000000000000));
  const addID = (arr) => {
    arr.map((item) => (item.productID = generateID()));
  };
  allObjData.push("menu");
  allObjData.forEach((item) => addID(data[item]));
};

const reFormatData = () => {
  allObjData.forEach((item) => {
    const newArr = [];
    for (const key in data[item]) {
      newArr.push(data[item][key]);
    }
    data[item] = newArr;
  });
};

reFormatData();
addIDforData();

const linkLogo = (currentCategory) => {
  switch (currentCategory) {
    case "doner":
      return "i/markets/doner.png";
    case "subway":
      return "i/markets/subway_logo.png";
    case "sfc":
      return "i/markets/south_fried_chicken.png";
    default:
      return "";
  }
};

const addEventOnIncDec = (className) => {
  const currentElement = document.querySelectorAll(className);
  for (let i = 0; i < currentElement.length; i++) {
    currentElement[i].addEventListener("click", () => {
      const result = data.menu.find(
        (item) =>
          item.productID ===
          currentElement[i].parentNode.parentNode.parentNode.id
      );
      className === ".product_inc"
        ? result.count++
        : result.count > 1 && result.count--;
      currentElement[i].parentNode.childNodes[3].innerHTML = result.count;
    });
  }
};

const deleteProduct = (id) => {
  const indexElem = shopingCart.findIndex((item) => item.productID === id);
  shopingCart.splice(indexElem, 1);
  renderShopingMenu();
};

const renderShopingMenu = () => {
  const contentSopingMenu = document.querySelector(".shopping_cart__content");
  const shopingCartPrice = document.querySelector(".shopping_cart__price");

  let element = "";

  if (shopingCart.length > 0) {
    shopingCart.map((item) => {
      element += `
      <div class="shopping_cart__item" id=${item.productID}>
        <p>${item.name}</p>
        <div>
          <p>${item.count}</p>
          <img class="shopping_cart__delete_icon" src="./i/trash_icon.png"  />
        </div>
      </div>
      `;
      contentSopingMenu.innerHTML = element;
    });
  } else {
    contentSopingMenu.innerHTML = "";
  }

  let priceShopingCard = [];
  let priceResult = 0;

  if (shopingCart.length) {
    priceShopingCard = shopingCart.map((item) => item.price * item.count);
    priceResult = priceShopingCard.reduce((acc, cur) => acc + cur);
  }

  shopingCartPrice.innerHTML = `Итого: ${priceResult} руб.`;

  const allDeleteButtons = document.querySelectorAll(
    ".shopping_cart__delete_icon"
  );
  for (let i = 0; i < allDeleteButtons.length; i++) {
    allDeleteButtons[i].addEventListener("click", () => {
      deleteProduct(allDeleteButtons[i].parentNode.parentNode.id);
    });
  }
};

const addProductInShoppingCard = (product) => {
  const findElement = shopingCart.find(
    (item) => item.productID === product.productID
  );

  if (findElement) {
    findElement.count += product.count;
  } else {
    shopingCart.push({ ...product });
  }

  renderShopingMenu();
};

const openModal = () => {
  //menu
  modalWindow.classList.add("open_modal");
};

const concatIdIngredients = () => {
  //modal
  const arr = [];
  allObjData.forEach((item) => {
    if (item !== "menu") data[item].forEach((key) => arr.push(key));
  });
  return arr;
};

const calculatePrice = () => {
  //modal
  const haveIngredients = document.querySelector(".have_ingredients");

  if (haveIngredients) {
    const result = customSandwich.allIdIngredients.map((item) =>
      concatIdIngredients().find((key) => key.productID === item)
    );

    if (result.length) {
      const arrPrice = result.map((item) => item.price);
      const calcValue = arrPrice.reduce((acc, cur) => acc + cur);
      customSandwich.price = calcValue;
    } else {
      customSandwich.price = 0;
    }
  } else {
    customSandwich.price = 0;
  }
};

const onClickCardInModal = (selectedElement, category) => {
  //modal
  const isMultipleCaterory =
    category === ALL_CATEGORIES.vegetables ||
    category === ALL_CATEGORIES.sauces ||
    category === ALL_CATEGORIES.fillings;

  const searchResults = data[category].find(
    (item) => item.productID === selectedElement.id
  );

  if (Object.keys(customSandwich).length === 5)
    customSandwich.allIdIngredients = [];

  if (!customSandwich.hasOwnProperty(category)) {
    selectedElement.classList.add("selected_ingredient");
    if (isMultipleCaterory) {
      customSandwich[category] = [searchResults];
    } else {
      customSandwich[category] = searchResults.name;
    }
    if (
      customSandwich.hasOwnProperty("allIdIngredients") &&
      !customSandwich.allIdIngredients.includes(selectedElement.id)
    ) {
      customSandwich.allIdIngredients.push(selectedElement.id);
    } else {
      if (!customSandwich.hasOwnProperty("allIdIngredients")) {
        customSandwich.allIdIngredients = [];
        customSandwich.allIdIngredients.push(selectedElement.id);
      }

      customSandwich.allIdIngredients.splice(
        customSandwich.allIdIngredients.findIndex(
          (item) => item === selectedElement.id
        ),
        1
      );
      selectedElement.classList.remove("selected_ingredient");
    }
  } else if (customSandwich.allIdIngredients.includes(selectedElement.id)) {
    selectedElement.classList.remove("selected_ingredient");

    if (isMultipleCaterory) {
      if (customSandwich[category].length === 1) {
        delete customSandwich[category];
      } else {
        customSandwich[category].splice(
          customSandwich[category].findIndex(
            (item) => item.productID === selectedElement.id
          ),
          1
        );
      }
    } else {
      delete customSandwich[category];
    }

    customSandwich.allIdIngredients.splice(
      customSandwich.allIdIngredients.findIndex(
        (item) => item === selectedElement.id
      ),
      1
    );

    if (customSandwich.allIdIngredients.length === 0) {
      delete customSandwich.allIdIngredients;
      customSandwich.price = 0;
    }
  } else {
    const cardsModal = document.querySelectorAll(".modal_window__card");
    const currentCard = document.querySelector(".selected_ingredient");

    if (!isMultipleCaterory) {
      customSandwich.allIdIngredients.splice(
        customSandwich.allIdIngredients.findIndex(
          (item) => item === currentCard.id
        ),
        1
      );
    }

    customSandwich.allIdIngredients.push(selectedElement.id);

    if (isMultipleCaterory) {
      customSandwich[category].push(searchResults);
      selectedElement.classList.add("selected_ingredient");
    } else {
      customSandwich[category] = searchResults.name;
    }

    for (let i = 0; i < cardsModal.length; i++) {
      !isMultipleCaterory &&
        cardsModal[i].classList.remove("selected_ingredient");
    }

    selectedElement.classList.add("selected_ingredient");
  }

  const allTabsModal = document.querySelectorAll(".modal_window__tab");
  for (let i = 0; i < allTabsModal.length; i++) {
    if (customSandwich.hasOwnProperty(allTabsModal[i].id)) {
      allTabsModal[i].classList.add("have_ingredients");
    } else {
      allTabsModal[i].classList.remove("have_ingredients");
    }
  }

  if (customSandwich.hasOwnProperty("allIdIngredients")) calculatePrice();
  modalPrice.innerHTML = `Цена: ${customSandwich.price || "0"} руб.`;
};

const onCloseModal = () => {
  //modal
  modalWindow.classList.remove("open_modal");

  const countPanel = document.querySelector(".count_modal");
  const modalBtn = document.querySelector(".modal_btn");

  if (countPanel) countPanel.remove();
  if (modalBtn) modalBtn.remove();

  for (let i = 0; i < tabsModal.length; i++) {
    tabsModal[i].classList.remove("active_ingredients");
    tabsModal[i].classList.remove("have_ingredients");
    if (i === 0) tabsModal[i].classList.add("active_ingredients");
  }
  Object.keys(customSandwich).forEach((key) => delete customSandwich[key]);
  modalPrice.innerHTML = "Цена: 0 руб.";
};

buttonCloseModal.addEventListener("click", onCloseModal);

const renderIngredients = (ingredients = "sizes") => {
  //modal
  const currentTextHeader = (tab) => {
    switch (tab) {
      case "sizes":
        return "Выберите размер сендвича";
      case "breads":
        return "Хлеб для сендвича на выбор";
      case "vegetables":
        return "Дополнительные овощи бесплатно";
      case "sauces":
        return "Выберите три бесплатных соуса по вкусу";
      case "fillings":
        return "Добавьте начинку по вкусу";
      case "done":
        return "Проверьте и добавьте в корзину";
    }
  };
  headerModalText.innerHTML = currentTextHeader(ingredients);

  let element = "";
  let element1 = "";

  if (ingredients !== "done") {
    modalIngredients.classList.remove("done_tab");
    data[ingredients].map((ingredients) => {
      ingredients.image = ingredients.image.substring(1);
      element += `
          <div class="modal_window__card" id=${ingredients.productID}>
            <div class="product_card__image modal_image">
              <img src=${ingredients.image} alt="no_image" />
            </div>
            <div class="modal_window__description">
              <p class="modal_window__text">${ingredients.name}</p>
              <p class="modal_window__price">Цена: ${ingredients.price} руб.</p>
            </div>
          </div>
          `;
      modalIngredients.innerHTML = element;
    });

    const allCardModal = document.querySelectorAll(".modal_window__card");
    for (let i = 0; i < allCardModal.length; i++) {
      if (
        customSandwich.hasOwnProperty("allIdIngredients") &&
        customSandwich.allIdIngredients.includes(allCardModal[i].id)
      )
        allCardModal[i].classList.add("selected_ingredient");

      allCardModal[i].addEventListener("click", () => {
        onClickCardInModal(allCardModal[i], ingredients);
      });
    }
  } else {
    modalIngredients.classList.add("done_tab");
    element = `
          <div class="modal_window__leftContent">
            <div class="product_card__image modal_image">
              <img src="${customSandwich.image}">
            </div>
          </div>
          <div class="modal_window__rightContent">
            <p class="modal_window__descriptionDone">Ваш сендвич готов!</p>
            <p>Размер: ${customSandwich.sizes || "-"}</p>
            <p>Хлеб: ${customSandwich.breads || "-"}</p>
            <p>Овощи: ${
              customSandwich.hasOwnProperty("vegetables")
                ? [...customSandwich.vegetables.map((item) => `${item.name} `)]
                : "-"
            }</p>
            <p>Соусы: ${
              customSandwich.hasOwnProperty("sauces")
                ? [...customSandwich.sauces.map((item) => `${item.name}`)]
                : "-"
            }</p>
            <p class="modal_window__descriptionLast">Начинка: ${
              customSandwich.hasOwnProperty("fillings")
                ? [...customSandwich.fillings.map((item) => `${item.name} `)]
                : "-"
            }</p>
            <p class="modal_window__nameSandwitch">${customSandwich.name}</p>
          </div>
      `;

    element1 = `
        <p>КОЛИЧЕСТВО</p>
        <div class="product_card__board modal_board">
          <button class="product_card__inc-dec dec_modal">-</button>
          <p class="product_card__value count_modal_value">${customSandwich.count}</p>
          <button class="product_card__inc-dec inc_modal">+</button>
        </div>
      `;

    modalIngredients.innerHTML = element;

    const countElement = document.createElement("div");
    const buttonElement = document.createElement("button");

    countElement.className = "product_card__count count_modal";
    buttonElement.className = "product_card_btn_add modal_btn";

    countElement.innerHTML = element1;
    buttonElement.innerText = "В корзину";

    buttonElement.addEventListener("click", () => {
      addProductInShoppingCard(customSandwich);
      onCloseModal();
    });

    footerModal.prepend(countElement);
    bottomFooter.appendChild(buttonElement);

    const incModal = document.querySelector(".inc_modal");
    const decModal = document.querySelector(".dec_modal");
    const valueModal = document.querySelector(".count_modal_value");

    incModal.addEventListener("click", () => {
      customSandwich.count++;
      valueModal.innerHTML = customSandwich.count;
    });

    decModal.addEventListener("click", () => {
      if (customSandwich.count > 1) {
        customSandwich.count--;
        valueModal.innerHTML = customSandwich.count;
      }
    });
  }
};

const collectProduct = (product) => {
  //menu
  if (!customSandwich.hasOwnProperty("nameSandwich"))
    customSandwich.name = product.name;
  if (!customSandwich.hasOwnProperty("image"))
    customSandwich.image = product.image;
  if (!customSandwich.hasOwnProperty("count"))
    customSandwich.count = product.count;
  if (!customSandwich.hasOwnProperty("productID"))
    customSandwich.productID = product.productID;
  if (!customSandwich.hasOwnProperty("price")) customSandwich.price = 0;

  openModal();
  renderIngredients();
};

const renderProducts = (currentCategory = "pizza") => {
  //menu
  const currentProducts = data.menu.filter(
    (item) => item.category === currentCategory
  );

  let element = "";

  currentProducts.map((product) => {
    const isSandwiches = product.category === "sandwiches";
    product.count = 1;
    product.image = product.image.substring(1);
    element += `
          <article class="product_card" id=${product.productID}>
              <div class=${
                product.market
                  ? "product_card__logo__show"
                  : "product_card__logo__hide"
              }>
                  <img src=${linkLogo(product.market)} />
              </div>
              <div class="product_card__image">
                <img src=${product.image} alt="no_image" />
              </div>
              <div class="product_card__name">
                  <p>${product.name}</p>
              </div>
              <div class=${
                product.description
                  ? "product_card__description__show"
                  : "product_card__description__hide"
              }>
                  <a>${product.description}</a>
              </div>
              ${
                isSandwiches
                  ? "<p></p>"
                  : `<p class="product_card__price">Цена: ${product.price} руб.</p>`
              }
              <div class="product_card__count">
                  <p>КОЛИЧЕСТВО</p>
                  <div class="product_card__board">
                      <button class="product_card__inc-dec product_dec">-</button>
                      <p class="product_card__value">${product.count}</p>
                      <button class="product_card__inc-dec product_inc">+</button>
                  </div>
              </div>
              <button class="product_card_btn_add">
                  ${isSandwiches ? "СОБРАТЬ" : "В КОРЗИНУ"}
              </button>
          </article>`;
    productsBoard.innerHTML = element;
  });

  const allCard = document.querySelectorAll(".product_card_btn_add");
  for (let i = 0; i < allCard.length; i++) {
    allCard[i].addEventListener("click", () => {
      const selectedProduct = data.menu.find(
        (item) => item.productID === allCard[i].parentNode.id
      );
      selectedProduct.category === "sandwiches"
        ? collectProduct(selectedProduct)
        : addProductInShoppingCard(selectedProduct);
    });
  }

  addEventOnIncDec(".product_inc");
  addEventOnIncDec(".product_dec");
};

const addEventsOnTabs = (categories, newClass) => {
  //menu
  for (let i = 0; i < categories.length; i++) {
    categories[i].addEventListener("click", (e) => {
      const currentChildren = e.target.parentElement.children;
      for (let i = 0; i < currentChildren.length; i++) {
        currentChildren[i].classList.remove(newClass);
        const countModal = document.querySelector(".count_modal");
        const btnModal = document.querySelector(".modal_btn");

        currentChildren[i].id === "done" &&
          countModal &&
          footerModal.childNodes[0].remove();
        bottomFooter.childNodes[3] &&
          btnModal &&
          bottomFooter.childNodes[3].remove();
      }
      e.target.classList.add(newClass);
      newClass === "active_tab"
        ? renderProducts(e.target.id)
        : renderIngredients(e.target.id);
    });
  }
};

const addEvents = () => {
  //menu
  addEventsOnTabs(allCategory, "active_tab");
  addEventsOnTabs(allTabs, "active_ingredients");
};

addEvents();
renderProducts();
