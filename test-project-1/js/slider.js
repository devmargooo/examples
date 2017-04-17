var slider = (function(){
	var PACKAGES_WINDOW_LENGTH = 3,
		SLIDER_LENGTH = 7;

	var data,
		guidMap = {
			"729485a8-89c6-4754-a4cd-59f19929928e":"packages__item-standart",
			"a7ce076d-aa6c-4409-8574-d0c03d729d44": "packages__item-new-bank",
			"e47c29b3-596d-4628-ab55-4df1457cf231": "packages__item-catalog",
			"112de555-826f-44d9-86e9-096f1071d1d6": "packages__item-catalog",
			"74dee4cd-84d0-4b8d-bf48-48474815bbac": "packages__item-catalog",
			"4bb0c4df-4f81-4bb0-b8ca-a5b5e85d827e": "packages__item-catalog",
			"9390d8a0-646a-481b-ad98-77ad51b59f01": "packages__item-catalog",
			"f92f3567-06c1-4cca-87db-834cc7f4b5d8": "packages__item-catalog",
			"ee2d083d-388d-43df-8264-c2b8cff0331e": "packages__item-catalog",
			"8a909b2c-d10f-4d46-8c08-0d2e4a3095ce": "packages__item-catalog"
		},
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
		list = document.querySelector(".packages__list"),
		sliderNavMarkers = document.querySelector(".packages__slider-nav-markers"),
		points = document.querySelector(".packages__slider-nav-markers").children,
		packagesArrowLeft = document.querySelector(".packages__arrow-left"),
		packagesArrowRight = document.querySelector(".packages__arrow-right"),
		initialFocusIndex,
		currentFocusIndex;

	SLIDER_LENGTH % 2 == 0? initialFocusIndex = Math.floor((SLIDER_LENGTH-1)/2) : initialFocusIndex = Math.floor(SLIDER_LENGTH/2);

	function renderPackage(dataItem){
		var templatePackageItem = document.querySelector(".template-package-item");
		var li = templatePackageItem.content.querySelector(".packages__item");
		li.classList.add(guidMap[dataItem.guid]);

		var caption = templatePackageItem.content.querySelector(".packages__package-name");
		caption.innerHTML = dataItem.title;

		var date = templatePackageItem.content.querySelector(".packages__package-date");
		var dateData = new Date(dataItem.lastUpdate*1000);
		var dateDataDay = dateData.getDate();
		if (dateDataDay < 10) dateDataDay = "0" + dateDataDay;
		date.innerHTML = dateDataDay + " " + monthMap[dateData.getMonth()] + " " + dateData.getFullYear();

		return document.importNode(templatePackageItem.content, true);
	}

	function renderRandomDataIndexes(packageCount, dataCount){
		var indexes = [];
		for (var i = 0; i < packageCount;){
			var index = Math.random() * dataCount;
			index = Math.floor(index);
			if (indexes.indexOf(index) == -1){
				indexes.push(index);
				i++;
			}
		}
		return indexes;
	}

	function findIndexFromWhichWindowStarts(focusedIndex, windowLength, sliderLength){
		var sliderCenter, windowCenter;
		sliderLength % 2 == 0? sliderCenter = Math.floor((sliderLength-1)/2):sliderCenter = Math.floor(sliderLength/2);// if sliderLength we says left of both center elements is center element
		windowLength % 2 == 0? windowCenter = Math.floor((windowLength-1)/2):windowCenter = Math.floor(windowLength/2);
		var tailLeft = windowCenter;//one more var for make logic clean
		var tailRight = windowLength - 1 - windowCenter;//max window index - center index
		var minCenterIndex = tailLeft;
		var maxCenterIndex = sliderLength - 1 - tailRight;
		if (focusedIndex<minCenterIndex) {
			firstIndexFromWhichWindowStarts = 0;
		};
		if (focusedIndex>maxCenterIndex){
			firstIndexFromWhichWindowStarts = sliderLength - windowLength;
		};
		if ((focusedIndex>=minCenterIndex)&&(focusedIndex<=maxCenterIndex)){
			firstIndexFromWhichWindowStarts = focusedIndex - tailLeft;
		}
		return firstIndexFromWhichWindowStarts;
	}

	function markFocusedPoint(focusedIndex){
		points[focusedIndex].classList.add("packages__slider-nav-point_active");
	}

	function renderPackages(focusedIndex){
		console.log("RENDERING! FOCUS IS " + focusedIndex);
		if (!data) {
			console.log("THERE IS NOT DATA FOR RENDER PACKAGES");
			return;
		}
		list.innerHTML = "";
		for (var i = 0; i<points.length; i++){
			if (points[i].classList.contains("packages__slider-nav-point_active")) points[i].classList.remove("packages__slider-nav-point_active");
		}
		if ((focusedIndex != 0)&&(packagesArrowLeft.classList.contains("packages__arrow_unactive"))){
			packagesArrowLeft.classList.remove("packages__arrow_unactive");
		}
		if ((focusedIndex != SLIDER_LENGTH - 1)&&(packagesArrowRight.classList.contains("packages__arrow_unactive"))){
			packagesArrowRight.classList.remove("packages__arrow_unactive");
		}

		var startIndex = findIndexFromWhichWindowStarts(focusedIndex, PACKAGES_WINDOW_LENGTH, SLIDER_LENGTH);
		for (var i = 0; i<PACKAGES_WINDOW_LENGTH; i++){
			var li = renderPackage(data[startIndex + i]);
			list.appendChild(li);
		}
		markFocusedPoint(focusedIndex);
		if (focusedIndex == 0) packagesArrowLeft.classList.add("packages__arrow_unactive");
		if (focusedIndex == SLIDER_LENGTH - 1) packagesArrowRight.classList.add("packages__arrow_unactive");
	}

	packagesArrowLeft.onclick = function(){
		if (currentFocusIndex === undefined) return;
		if (currentFocusIndex > 0){//more clean condition
			currentFocusIndex--;
			renderPackages(currentFocusIndex);
		};
	}

	packagesArrowRight.onclick = function(){
		if (currentFocusIndex === undefined) return;
		if (currentFocusIndex < SLIDER_LENGTH - 1){//last slider index
			currentFocusIndex++;
			renderPackages(currentFocusIndex);
		};
	}

	sliderNavMarkers.onclick = function(e){
		if (!e.target.classList.contains("packages__slider-nav-point")) return;//click on empty area between points
		for (var i = 0; i<points.length; i++){
			if (points[i] == e.target) {
				renderPackages(i);
			}
		}
	}

	return {
		init: function(){
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "api/apps_packages.json", true);
			xhr.send();
			xhr.onload = function(){
				if (xhr.status != 200) {
			    console.log(xhr.status + ': ' + xhr.statusText);
			  } else {
			    data = JSON.parse(xhr.responseText);
					renderPackages(initialFocusIndex);
					currentFocusIndex = initialFocusIndex; //one more var for make logic clean
			  }
			}
		}
	}
}());

slider.init();
