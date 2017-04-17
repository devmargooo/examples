var apps = (function(){
  var BASKET_NAV_STEPS_COUNT = 4,
  PAYMENT_TABLE_COLUMNS = 4,
  appsData,
  appsDataExtended,
  appsList = document.querySelector(".apps__list"),
  catalogButtonAdd,
  showingAppId,
  basket,
  basketPic = document.querySelector(".basket-pic"),
  basketCount,
  innerBody = document.querySelector(".page-innerbody"),
  paymentTableContainer,
  disabledButtonsMap = {},
  finalSumElement,
  catalogButtonAddClick = function(){
    catalogButtonAdd = document.querySelector(".catalog__button-add");
    if (catalogButtonAdd.classList.contains("catalog__button-add_disabled")) return;
    if (showingAppId === undefined) return;
    if (!appsDataExtended) return;
    if (!basket) {
      basket = new Basket();
    };
    basket.add(appsDataExtended[showingAppId]);
    renderBasketCount(basket.getCount());
    if (catalogButtonAdd) catalogButtonAdd.classList.add("catalog__button-add_disabled");
  };

  function renderApp(data){
    var templateAppsItem = document.querySelector(".template-apps-item"),
    li = templateAppsItem.content.querySelector(".apps__item");
    li.dataset.id = data.id;
    var a = templateAppsItem.content.querySelector(".apps__anchor");
    a.textContent = data.title;
    return document.importNode(templateAppsItem.content, true);
  }

  function renderApps(){
    for (var i = 0; i < appsData.length; i++){
      appsList.appendChild(renderApp(appsData[i]));
    }
  }

  appsList.onclick = function(e){
    var target = e.target;
    while (target != appsList) {
      if (target.classList.contains("apps__item")) {
        if (!target.dataset.id) return;
        var listItemNumber = target.dataset.id;

        if (!appsDataExtended){
          console.log("DATA NOT FOUND");
          return;
        }
        showApp(appsDataExtended[listItemNumber]);
      }
      target = target.parentNode;
    }
  }

  function renderFeature(feature){
    var li = document.createElement('li');
    li.classList.add("catalog__functions-item");
    li.textContent = feature;
    return li;
  }

  function showApp(data){
    var heading = document.querySelector(".catalog__heading_product"),
    catalogButtonAdd = document.querySelector(".catalog__button-add"),
    date = document.querySelector(".catalog__description-date"),
    monthMap = {
      0: "января",
      1: "февраля",
      2: "марта",
      3: "апреля",
      4: "мая",
      5: "июня",
      6: "июля",
      7: "августа",
      8: "сентября",
      9: "октября",
      10: "ноября",
      11: "декабря"
    },
    description  = document.querySelector(".catalog__description-about-description"),
    requirementsBolder = document.querySelector(".catalog__description-about-requirements_bolder"),
    requirements = document.querySelector(".catalog__description-about-requirements"),
    guidMap = {
      "729485a8-89c6-4754-a4cd-59f19929928e":"catalog__product-image-standart",
      "a7ce076d-aa6c-4409-8574-d0c03d729d44": "catalog__product-image-new-bank",
      "f5b52fc0-8dc6-4ddc-ae0f-69523a7cd7d9": "catalog__product-image-default",
      "11298cdf-e96c-40e2-b754-d0126a6d7488": "catalog__product-image-default",
      "e851525c-209b-43fe-b3cb-06d107cb9a3d": "catalog__product-image-default",
      "db3c50e5-40d9-42cd-85f4-09cba1a60390": "catalog__product-image-default",
      "63d8eab0-08cb-43ae-975d-7c4433a2f5e3": "catalog__product-image-default",
      "f9ea6121-55d3-4ba7-be62-f058c159a8ce": "catalog__product-image-default",
      "9d411c5c-0395-4bdf-a8e0-f603b35c0d96": "catalog__product-image-default",
      "106f6881-d485-49ff-9709-d9f26e3c2f9d": "catalog__product-image-default",
      "15cd91bf-3899-416e-95f8-e52581a4a5c0": "catalog__product-image-default",
      "6b4379f1-e6c5-4a69-afce-5a359ac1c209": "catalog__product-image-default",
      "19247b85-417d-47bf-a859-4aca879ae273": "catalog__product-image-default",
      "b86753d2-8aed-4266-80cf-9443ca519b07": "catalog__product-image-default"
    },
    priceBolder = document.querySelector(".catalog__description-about-price_bolder"),
    catalogFeaturesList = document.querySelector(".catalog__features-list"),
    catalogProductImage = document.querySelector(".catalog__product-image"),
    price = document.querySelector(".catalog__description-about-price-price"),
    dateData;

    if (catalogButtonAdd != undefined) {
      var parent = catalogButtonAdd.parentNode;
      parent.removeChild(catalogButtonAdd);
    }
    catalogFeaturesList.innerHTML = "";
    catalogProductImage.classList = "catalog__product-image";
    heading.textContent = data.title.toUpperCase();
    dateData = new Date(data.lastUpdate*1000);
  	var dateDataDay = dateData.getDate();
  	if (dateDataDay < 10) dateDataDay = "0" + dateDataDay;
  	date.textContent = dateDataDay + " " + monthMap[dateData.getMonth()] + " " + dateData.getFullYear();
    description .innerHTML= data.description.replace( /\n/g, "<br>" );
    requirementsBolder.textContent = "Требования:";
    requirements.textContent = data.requirements;
    priceBolder.textContent = "Цена: ";
    price.textContent = data.price;
    for (var i = 0; i < data.features.length; i++){
      var li = renderFeature(data.features[i]);
      catalogFeaturesList.appendChild(li);
      var catalogFeaturesListHeight = catalogFeaturesList.offsetHeight;
      if (catalogFeaturesListHeight>400){
        catalogFeaturesList.removeChild(li);
        break;
      }
    }
    catalogProductImage.classList.add(guidMap[data.guid]);
    showingAppId = data.id;
    basket? renderBasketCount(basket.getCount()) : renderBasketCount (0);
    var buttonAdd = document.createElement('a');
    buttonAdd.classList = "button";
    buttonAdd.classList.add("catalog__button-add");

    if (disabledButtonsMap[heading.textContent]){
      buttonAdd.classList.add("catalog__button-add_disabled");
    }
    buttonAdd.setAttribute("href", "#");
    buttonAdd.textContent = "В корзину";
    buttonAdd.addEventListener("click", catalogButtonAddClick);
    var image = document.querySelector(".catalog__product-image");
    var catalog = document.querySelector(".catalog");
    catalog.insertBefore(buttonAdd, image.nextSibling);
  }

  function renderBasketCount(basketCount){
    var basketCountField = document.querySelector(".basket-count-field");
    if (!basketCountField){
      console.log("BASKET COUNT FIELD NOT FOUND");
      return;
    }
    basketCount = localStorage.getItem("basket_count")||0;
    basketCountField.innerHTML = "";
    basketCountField.textContent = "("+basketCount+")";
  }

  Basket = function(){
    content = [];
    this.addToContent = function(product){
      for (var i = 0; i<content.length; i++){
        if (content[i].id == product.id) return;
      }
      content.push(product);
      disabledButtonsMap[product.title.toUpperCase()] = true;
    }
    this.add = function(product){
      for (var i = 0; i<content.length; i++){
        if (content[i].id == product.id) return;
      }
      content.push(product);
      disabledButtonsMap[product.title.toUpperCase()] = true;
      localStorage.setItem("basket_count", this.getCount());//replace old value
      var currentBasketProductsId = localStorage.getItem("basket_products_id");
      if (!currentBasketProductsId) {
        localStorage.setItem("basket_products_id", product.id);
      }
      else {
        localStorage.setItem("basket_products_id", currentBasketProductsId + " " + product.id);
      };
    };
    this.remove = function(product){
      for (var i=0; i<content.length; i++){
        if (content[i].id === product.id){
          if (i === content.length-1){//last element in basket
            content.pop();
          }
          else {
            for (var k=i+1; k<content.length; k++, i++){
              content[i] = content[k];
            }
            content.pop();
          }
        }
      }
      disabledButtonsMap[product.title.toUpperCase()] = undefined;
      var currentBasketProductsId = localStorage.getItem("basket_products_id");
      var currentBasketProductsIdArr = currentBasketProductsId.split(" ");
      var position = currentBasketProductsIdArr.indexOf(product.id);
      if (position === -1) {
        console.log("ERROR OF REMOVING PRODUCT FROM LOCAL STORAGE");
      } else {
        arr.splice(position, 1);
      }
      console.log(getBasketProductsIdFromLocalStorage());
      localStorage.setItem("basket_count", this.getCount());
    };
    this.removeById = function(index){
      if (!content[index]){
        console.log ("NOT FOUND OBJECT DURING REMOVING BY ID");
        return;
      }
      disabledButtonsMap[content[index].title.toUpperCase()] = undefined;
      var currentBasketProductsId = localStorage.getItem("basket_products_id");
      var currentBasketProductsIdArr = currentBasketProductsId.split(" ");
      var position = currentBasketProductsIdArr.indexOf("" + content[index].id);
      if (index === content.length-1){//last element in basket
        content.pop();
      }
      else {
        for (var k=index+1; k<content.length; k++, index++){
          content[index] = content[k];
        }
        content.pop();
      }

      if (position === -1) {
        console.log("ERROR OF REMOVING PRODUCT FROM LOCAL STORAGE");
      } else {
        currentBasketProductsIdArr.splice(position, 1);
        currentBasketProductsId = currentBasketProductsIdArr.join(" ");
        localStorage.setItem("basket_products_id", currentBasketProductsId);
      }
      localStorage.setItem("basket_count", this.getCount());
    };
    this.getCount = function(){
      return content.length;
    };
    this.getElement = function(number){
      return content[number];
    }
    this.getFinalSum = function(){
      var sumObj = {
        "primary": 0,
        "secondary": 0
      },
      sum = 0;
      if (!content) return sumObj;
      for (var i = 0; i<content.length; i++){
        sum += (parseFloat(content[i].price)*100);
      }
      var secondaryPart = sum % 100;
      var primaryPart = Math.floor((sum - secondaryPart)/100);
      sumObj.primary = primaryPart;
      sumObj.secondary = secondaryPart;
      return sumObj;
    }
    this._printlog = function(){
      console.log("content length: "+ content.length);
      for (i = 0; i < content.length; i++){
        console.log(content[i]);
      };
    };
    this.restoreData = function(arrayOfProductsId, dataArray){
      for (var i = 0; i < arrayOfProductsId.length; i++){
        var id = parseInt(arrayOfProductsId[i], 10);
        if (!dataArray[id]) console.log("ERROR LOAD DATA FOR RESTORING");
        this.addToContent(appsDataExtended[id]);
      }
    }
  }

  function getBasketProductsIdFromLocalStorage(){
    var productsId = localStorage.getItem("basket_products_id");
    var arr = productsId .split(" ");
    return arr;
  }

  basketPic.onclick = function(){
    renderBasketBody(0);
  }

  function renderBasketBody(currentPayingStep){
    var innerBasketBodyUnderNav;

    if (!basket || (basket.getCount() === 0)){
      renderBasketIsEmptyMsg();
      return;
    }
    innerBody.innerHTML = "";
    switch (currentPayingStep) {
      case 0:
        innerBody.classList = "payment-wrapper";
        innerBody.classList.add("apps-page-innerbody");
        innerBody.appendChild(renderBasketNav(currentPayingStep));
        var innerBasketBodyUnderNav = document.createElement('div');
        innerBasketBodyUnderNav.classList = "inner-basket-body-under-nav";
        innerBody.appendChild(innerBasketBodyUnderNav);

        var table = renderPaymentTable();
        innerBasketBodyUnderNav.appendChild(table);

        paymentTableContainer = document.querySelector(".payment-table-container");
        paymentTableContainer.onclick = deleteProductFromList;
        var tableHeight = paymentTableContainer.scrollHeight;
        var maxHeight = parseInt(getComputedStyle(paymentTableContainer).maxHeight, 10);
        if (tableHeight > maxHeight) {
          paymentTableContainer.style.outline = "1px solid lightgrey";
        }
        if (tableHeight <= maxHeight) {
          paymentTableContainer.style.outline = "none";
        }
        var finalSum = renderFinalSum(basket);
        innerBasketBodyUnderNav.appendChild(finalSum);

        var buttonNextToTheSecondStage = document.createElement('a');
        buttonNextToTheSecondStage.className = "button button-execute payment-wrapper__button-next";
        buttonNextToTheSecondStage.textContent = "ДАЛЕЕ";
        buttonNextToTheSecondStage.onclick = function(){
          renderBasketBody(1);
        }
        innerBasketBodyUnderNav.appendChild(buttonNextToTheSecondStage);

        getBasketProductsIdFromLocalStorage();
        break;
      case 1:
        innerBody = document.querySelector(".apps-page-innerbody");
        innerBody.appendChild(renderBasketNav(currentPayingStep));
        nav = document.querySelector(".payment-main-nav");
        nav.onclick = usePointsNavigation;
        innerBody.appendChild(renderBasketBodyUnderNaveStep1());
        var buttonComeBack = document.querySelector(".payment-wrapper__button-come-back");
        buttonComeBack.onclick = function(){
          renderBasketBody(0);
          return false;
        }
        var buttonPay = document.querySelector(".payment-wrapper__button-pay");
        buttonPay.onclick = function(){
          var timer = setTimeout(function(){
            renderBasketBody(2);
          }, getRandomTime());
          showAnimation();
          return false;
        }
        break;
      case 2:
        var animation = document.querySelector(".template-animation");
        if (!animation.hidden) {
          animation.hidden = true;
        }
        innerBody = document.querySelector(".apps-page-innerbody");
        innerBody.appendChild(renderBasketNav(currentPayingStep));
        nav = document.querySelector(".payment-main-nav");
        nav.onclick = usePointsNavigation;
        innerBody.appendChild(renderBasketBodyUnderNaveStep2());
        var buttonFinish = document.querySelector(".payment-wrapper__button-finish");
        buttonFinish.onclick = function(){
          var timer = setTimeout(function(){
            renderBasketBody(3);
          }, getRandomTime());
          showAnimation();
          return false;
        }
        break;
      case 3:
        var animation = document.querySelector(".template-animation");
        if (!animation.hidden) {
          animation.hidden = true;
        }
        innerBody = document.querySelector(".apps-page-innerbody");
        innerBody.appendChild(renderBasketNav(currentPayingStep));
        nav = document.querySelector(".payment-main-nav");
        nav.onclick = usePointsNavigation;
        innerBody.appendChild(renderBasketBodyUnderNaveStep3());
        break;
      default:
        break;
    };
  }

  function usePointsNavigation(e){
    if (e.target.classList.contains("payment-main-nav__point_done")){
      var points = document.querySelectorAll(".payment-main-nav__point");
      for (var i = 0; i < points.length; i++){
        if (e.target == points[i]) {
          renderBasketBody(i);
        }
      }
    }
    return false;
  };

  function renderBasketBodyUnderNaveStep1(){
    var templ = document.querySelector(".template-inner-basket-body-under-nav-step-1");
    return document.importNode(templ.content, true);
  }

  function renderBasketBodyUnderNaveStep2(){
    var templ = document.querySelector(".template-inner-basket-body-under-nav-step-2");
    return document.importNode(templ.content, true);
  }

  function renderBasketBodyUnderNaveStep3(){
    var templ = document.querySelector(".template-inner-basket-body-under-nav-step-3");
    return document.importNode(templ.content, true);
  }

  function renderBasketIsEmptyMsg(){
    console.log("basket is empty");
    innerBody.innerHTML = "";
    innerBody.classList = "payment-wrapper";
    innerBody.classList.add("apps-page-innerbody");
    var msg = document.createElement('div');
    msg.classList = "basket-is-empty-msg";
    msg.textContent = "Корзина пуста. Купите что-нибудь:)";
    innerBody.appendChild(msg);
  }

  function markNavVisetedSteps(currentPayingStep){

  }

  function renderBasketNav(currentPayingStep){
    var basketNavStepsCaptionMap = {
      0:"КОРЗИНА",
      1:"ОПЛАТА",
      2:"ДОСТАВКА",
      3:"ЗАВЕРШЕНО"
    },
    templateNav = document.querySelector(".template-nav"),
    nav = templateNav.content.querySelector(".payment-main-nav"),
    ul = templateNav.content.querySelector(".payment-main-nav__progress");

    while(ul.children.length){
      ul.removeChild(ul.children[0]);
    }
    for (var i = 0; i < BASKET_NAV_STEPS_COUNT; i++){
      if (i < currentPayingStep){

        var templateNavItemVisited = document.querySelector(".template-nav-item-visited");
        var caption = templateNavItemVisited.content.querySelector(".payment-main-nav__point-caption");
        caption.textContent = basketNavStepsCaptionMap[i];
        ul.appendChild(document.importNode(templateNavItemVisited.content, true));

      } else if (i === currentPayingStep){

        var templateNavItemCurrent = document.querySelector(".template-nav-item-current");
        var stepCount = templateNavItemCurrent.content.querySelector(".payment-main-nav__point");
        stepCount.textContent = i + 1;
        var caption = templateNavItemCurrent.content.querySelector(".payment-main-nav__point-caption");
        caption.textContent = basketNavStepsCaptionMap[i];
        ul.appendChild(document.importNode(templateNavItemCurrent.content, true));

      } else if (i > currentPayingStep){

        var templateNavItemUnvisited = document.querySelector(".template-nav-item-unvisited");
        var stepCount = templateNavItemUnvisited.content.querySelector(".payment-main-nav__point");
        stepCount.textContent = i + 1;
        var caption = templateNavItemUnvisited.content.querySelector(".payment-main-nav__point-caption");
        caption.textContent = basketNavStepsCaptionMap[i];
        ul.appendChild(document.importNode(templateNavItemUnvisited.content, true));
      }
    }
    return document.importNode(templateNav.content, true);
  }

  function renderPaymentTable(){
    var templatePaymentTable = document.querySelector(".template-payment-table");
    var table = templatePaymentTable.content.querySelector(".payment-table");

    while(table.children.length){
      table.removeChild(table.children[0]);
    }

    var tHeader = renderPaymentTableHeader();
    table.appendChild(renderPaymentTableHeader());

    var basketCount = localStorage.getItem("basket_count");
    var currentBasketProductsId = localStorage.getItem("basket_products_id");
    var currentBasketProductsIdArr = currentBasketProductsId.split(" ");

     loadData("api/apps_info.json")
          .then(function(data){
            appsDataExtended = data;
        })
          .catch(function(status){
            console.log(status);
          });

    var tr;
    for (var i = 0; i<basketCount; i++){
      for (var j = 0; j < appsDataExtended.length; j++){
        if (appsDataExtended[j].id == parseInt(currentBasketProductsIdArr[i], 10)){
          tr = renderProductItem(appsDataExtended[j]);
        }
      }
      if (!tr) console.log("ERROR RESTORING DATA FROM LOCAL STORAGE");
      table.appendChild(tr);
    }
    return document.importNode(templatePaymentTable.content, true);
  }

  function renderPaymentTableHeader(){
    var templateTHeader = document.querySelector(".template-payment-table-header");
    return document.importNode(templateTHeader.content, true);
  }

  function renderProductItem(product){
    var infoMap = {
      0: "title",
      1: "price",
      2: "price",
      3: false
    },
    templateTRow = document.querySelector(".template-payment-table-row"),
    tds = templateTRow.content.querySelectorAll("td");
    if (tds.length != PAYMENT_TABLE_COLUMNS){
      console.log("TABLE ROW RENDERING ERROR");
    } else for (var i = 0; i<PAYMENT_TABLE_COLUMNS; i++){
      var info = product[infoMap[i]];
      if (info) {
        tds[i].innerHTML = info;
      }
    }
    return document.importNode(templateTRow.content, true);
  }

  function renderPaymentTableDeleteFromListButton(){
    var button = document.createElement("button");
    button.classList = "payment-table__delete-button";
    return button;
  }

  var deleteProductFromList = function(e) {
    var paymentTableDeleteButtons;

    paymentTableDeleteButtons= document.querySelectorAll(".payment-table__delete-button")
    if (e.target.tagName!="BUTTON") return;
    if(!paymentTableDeleteButtons){
      console.log("DELETE BUTTONS NOT FOUND");
      return;
    }
    for (var i = 0; i<paymentTableDeleteButtons.length; i++){
      if (e.target == paymentTableDeleteButtons[i]){
        var currentNode = e.target;
        while(currentNode.tagName!="TABLE"){
          if (currentNode.tagName == "TR"){
            var parentNode = currentNode.parentNode;
            parentNode.removeChild(currentNode);
            break;
          }
          currentNode = currentNode.parentNode;
        }
        if (currentNode.tagName == "TABLE"){
          console.log ("PARENT ROW NOT FOUND");
          return;
        }
        if (!basket){
          console.log("BASKET WRITING DATA ERROR");
        } else {
          basket.removeById(i);
        }
        renderBasketCount(basket.getCount());
      }
    }
    var finalSumElement = document.querySelector(".payment-wrapper__final-sum");
    fillFinalSumm(basket, finalSumElement);
    var someTd = paymentTableContainer.querySelector("td");
    if (!someTd) {
      renderBasketIsEmptyMsg();
    }

    paymentTableContainer = document.querySelector(".payment-table-container");
    paymentTableContainer.onclick = deleteProductFromList;
    var tableHeight = paymentTableContainer.scrollHeight;
    var maxHeight = parseInt(getComputedStyle(paymentTableContainer).maxHeight, 10);
    if (tableHeight > maxHeight) {
      paymentTableContainer.style.outline = "1px solid lightgrey";
    }
    if (tableHeight <= maxHeight) {
      paymentTableContainer.style.outline = "none";
    }
  }

  function renderFinalSum(basket){
    finalSumElement = document.createElement('div');
    finalSumElement.classList = "payment-wrapper__final-sum";

    var text = document.createElement('span');
    text.classList = "payment-wrapper__final-sum-text";
    text.textContent = "ИТОГО";
    finalSumElement.appendChild(text);

    var primary = document.createElement('span');
    primary.classList = "payment-wrapper__final-sum-primary";
    finalSumElement.appendChild(primary);

    var secondary = document.createElement('span');
    secondary.classList = "payment-wrapper__final-sum-secondary";
    finalSumElement.appendChild(secondary);

    fillFinalSumm(basket, finalSumElement);
    return finalSumElement;
  }

  function fillFinalSumm(basket, field){
    primaryField = field.querySelector(".payment-wrapper__final-sum-primary");
    secondaryField = field.querySelector(".payment-wrapper__final-sum-secondary");
    var price = basket.getFinalSum();
    primaryField.textContent = price.primary + "$";
    if (price.secondary < 10) {
      price.secondary = "0" + price.secondary;
    }
    secondaryField.textContent = price.secondary;
  }


  function initData() {

    var products = localStorage.getItem("basket_products_id");//load saved data
    if (products){
      var productsArr = products.split(" ");
    }

    loadData("api/apps_list.json")//load apps list
      .then(function(data){
        appsData = data;
        renderApps();
      })
      .catch(function(status){
        console.log(status);
      });

    loadData("api/apps_info.json")//load full data from the server
      .then(function(data){
        appsDataExtended = data;
        basket = new Basket();
        if (products) basket.restoreData(productsArr, appsDataExtended);
        showApp(appsDataExtended[0]);
      })
      .catch(function(status){
        console.log(status);
      });

  }

  function getRandomTime(){
    return Math.floor(Math.random() * (2500 - 1000) + 1000);
  }

  function showAnimation(){
    var animation = document.querySelector(".template-animation");
    animation.hidden = false;
  }

  function restoreAfterStorageChange(){
    if (!appsDataExtended){
      console.log("STORAGE EVENT ERROR");
      restoreData();
      return;
    };
    var products = localStorage.getItem("basket_products_id");
    if (products){
      var productsArr = products.split(" ");
    }
    basket = new Basket();
    if (products) basket.restoreData(productsArr, appsDataExtended);
    renderBasketCount(basket.getCount());

    if (document.querySelector(".payment-table-container")){
      renderBasketBody(0);
    }
  }

  function loadData(url){
    return new Promise(function(resolve, reject){
      var xhr = new XMLHttpRequest();
       xhr.open("GET", url, true);
       xhr.send();
       xhr.onload = function(){
          if(xhr.status != 200){
            reject(xhr.status);
          }
          var data = JSON.parse(xhr.responseText);
          resolve(data);
       };
    });
  };

  window.addEventListener("storage", restoreAfterStorageChange, false);

  return {
    initData: initData
  }
}());

document.addEventListener("DOMContentLoaded", apps.initData());
