/*asynchronous function allows rest of code continuing executing while waiting for 
	the asynchronous operation to complete.*/
async function fetchCourses() {
	try {
		const response = await fetch("courses.json"); //fetch = HTTP request for courses.json file.
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`); //throws 404 to console if it doesn't find the file.
		}
		const accessCourses = await response.json(); //json() is parsing courses.json file and converts it to a javaScript object (is the file itself).
		const courses = accessCourses.courses; //In the converted JSON file use the courses array inside and assign it to a variable called courses.

		//Get and declare the languages, and set in sv/en functions
		const h1 = document.querySelector("#h1");
		const h5 = document.querySelector("#offcanvasNavbarLabel");
		const prisTitle = document.querySelector("#prisTitle");
		const priceAscendingLabel = document.querySelector("#priceAscendingLabel");
		const priceDescendingLabel = document.querySelector(
			"#priceDescendingLabel"
		);
		const proteinTitle = document.querySelector("#proteinTitle");
		const meatVegetarianLabel = document.querySelector("#meatVegetarianLabel");
		const meatChickenLabel = document.querySelector("#meatChickenLabel");
		const meatPorkLabel = document.querySelector("#meatPorkLabel");
		const meatBeefLabel = document.querySelector("#meatBeefLabel");
		const meatFishLabel = document.querySelector("#meatFishLabel");
		const allergiesTitle = document.querySelector("#allergiesTitle");
		const lactoseLabel = document.querySelector("#lactoseLabel");
		const glutenLabel = document.querySelector("#glutenLabel");
		const englishBtn = document.getElementById("englishBtn");
		const svenskaBtn = document.getElementById("svenskaBtn");

		function svTranslation() {
			h1.textContent = "Lucky Duck Café & Bar";
			h5.textContent = "Lucky Duck Café & Bar";
			prisTitle.textContent = "Pris-filter";
			priceAscendingLabel.textContent = "Stigande priser";
			priceDescendingLabel.textContent = "Fallande priser";
			proteinTitle.textContent = "Protein Val";
			meatVegetarianLabel.textContent = "Vegetarisk";
			meatChickenLabel.textContent = "Kyckling";
			meatPorkLabel.textContent = "Fläsk";
			meatBeefLabel.textContent = "Nöt";
			meatFishLabel.textContent = "Fisk";
			allergiesTitle.textContent = "Allergier";
			lactoseLabel.textContent = "Laktosfritt";
			glutenLabel.textContent = "Gluten-free";
		}

		function enTranslation() {
			h1.textContent = "Lucky Duck Café & Bar";
			h5.textContent = "Lucky Duck Café & Bar";
			prisTitle.textContent = "Price-filter";
			priceAscendingLabel.textContent = "Ascending prices";
			priceDescendingLabel.textContent = "Descending prices";
			proteinTitle.textContent = "Protein choice";
			meatVegetarianLabel.textContent = "Vegetarian";
			meatChickenLabel.textContent = "Chicken";
			meatPorkLabel.textContent = "Pork";
			meatBeefLabel.textContent = "Beef";
			meatFishLabel.textContent = "Fish";
			allergiesTitle.textContent = "Allergies";
			lactoseLabel.textContent = "Lactose-free";
			glutenLabel.textContent = "Gluten-free";
		}

		//The language buttons. Changes menu lang => rest of site lang => run main function
		englishBtn.addEventListener("click", function () {
			language = "en";
			enTranslation();
			showCourses(language, courses);
		});
		svenskaBtn.addEventListener("click", function () {
			language = "sv";
			svTranslation();
			showCourses(language, courses);
		});

		svTranslation(); //Swedish to default language on rest of the site
		let language = "sv"; //Swedish to default language on menu; JSON "sv"

		// stopPropogation() prevents closing of filter/sorting dropdowns (but not clicks like preventDefault())
		const preventClose = document.querySelectorAll(".dropdown");
		preventClose.forEach((box) => {
			box.addEventListener("click", (event) => {
				event.stopPropagation();
			});
		});

		//Get and declare the filters/sorting
		let meatVegetarianCheck = document.querySelector("#meatVegetarianCheck");
		let meatChickenCheck = document.querySelector("#meatChickenCheck");
		let meatPorkCheck = document.querySelector("#meatPorkCheck");
		let meatBeefCheck = document.querySelector("#meatBeefCheck");
		let meatFishCheck = document.querySelector("#meatFishCheck");
		let glutenCheck = document.querySelector("#glutenCheck");
		let lactoseCheck = document.querySelector("#lactoseCheck");
		let priceAscendingCheck = document.querySelector("#priceAscendingCheck");
		let priceDescendingCheck = document.querySelector("#priceDescendingCheck");

		//main function for all the logic
		function showCourses(language, courses) {
			//if checkboxes checked, push up the corresponding values to the empty array
			const selectedFoodTypes = [];

			if (meatChickenCheck.checked) {
				selectedFoodTypes.push("Kyckling", "Chicken");
			}
			if (meatPorkCheck.checked) {
				selectedFoodTypes.push("Fläsk", "Pork");
			}
			if (meatBeefCheck.checked) {
				selectedFoodTypes.push("Nöt", "Beef");
			}
			if (meatFishCheck.checked) {
				selectedFoodTypes.push("Fisk", "Fish");
			}
			if (meatVegetarianCheck.checked) {
				selectedFoodTypes.length = 0;
				selectedFoodTypes.push("Vegetarisk", "Vegetarian");
			}

			//same here but for allergies
			const selectedAllergyTypes = [];
			if (glutenCheck.checked) {
				selectedAllergyTypes.push("Gluten", "Gluten");
			}
			if (lactoseCheck.checked) {
				selectedAllergyTypes.push("Laktos", "Lactose");
			}

			/*if the "selectedFoodTypes" array has any foodtype in it, then filter
			through JSON "courses" and returns the courses that includes ANY (some) of
			the foodtypes that are selected. Set those courses to "filteredCourses" array.
			If not, then just return the original "courses" to the "filteredCourses" array.*/
			const filteredCourses =
				selectedFoodTypes.length > 0
					? courses.filter((course) => {
							const courseFoodType = course.foodType[language];
							return selectedFoodTypes.some((selectedFoodType) =>
								courseFoodType.includes(selectedFoodType)
							);
					  })
					: courses;

			/* Same logic but for allergies. However, this filters through
			"filteredCourses" array above. And this checks if the
			courses allergies DOES NOT include any the selected allergies*/
			const filteredAllergyCourses =
				selectedAllergyTypes.length > 0
					? filteredCourses.filter((course) => {
							const courseAllergyType = course.allergies[language];
							return !selectedAllergyTypes.some((selectedAllergyType) =>
								courseAllergyType.includes(selectedAllergyType)
							);
					  })
					: filteredCourses;

			/*Had to reference the same array again to make it work*/
			let sortedCourses = filteredAllergyCourses;

			/*Sorts the filtered array either in ascending or descending order
			based on price. "toSorted" maintains the original unsorted menu order.*/
			if (priceAscendingCheck.checked) {
				sortedCourses = filteredAllergyCourses.toSorted((courseA, courseB) => {
					return courseA.price[language] - courseB.price[language];
				});
			} else if (priceDescendingCheck.checked) {
				sortedCourses = filteredAllergyCourses.toSorted((courseA, courseB) => {
					return courseB.price[language] - courseA.price[language];
				});
			}

			//"output" is where all the courses ("card") will get displayed
			let output = document.getElementById("cards-menu");
			output.innerHTML = "";

			sortedCourses.forEach((course) => {
				const card = document.createElement("div");
				card.classList.add("col-md-6", "mb-3");

				/*if an object has "priceHalf" in courses.json, print out course this way...
				...else the normal way*/
				if (course.priceHalf) {
					card.innerHTML += `<h2>${course.name[language]}<br />${course.sizeHalf[language]} ${course.priceHalf[language]} ${course.currency[language]} - ${course.sizeWhole[language]} ${course.price[language]} ${course.currency[language]}</h2><p>${course.about[language]}</p>`;
				} else {
					card.innerHTML += `<h2>${course.name[language]} - ${course.price[language]} ${course.currency[language]}</h2><p>${course.about[language]}</p>`;
				}
				output.appendChild(card);
			});
		} //end of main function (showCourses)

		//call main fucntion initially to display all courses
		showCourses(language, courses);

		//If vegeterian is checked, uncheck all the others
		meatVegetarianCheck.addEventListener("change", function () {
			if (this.checked) {
				meatChickenCheck.checked = false;
				meatPorkCheck.checked = false;
				meatBeefCheck.checked = false;
				meatFishCheck.checked = false;
			}
			showCourses(language, courses);
		});

		//Uncheck vegetarian box if any of the meat types is checked
		const realMeatTypeCheck = [
			meatChickenCheck,
			meatPorkCheck,
			meatBeefCheck,
			meatFishCheck,
		];

		realMeatTypeCheck.forEach((realMeatCheck) => {
			realMeatCheck.addEventListener("change", function () {
				if (this.checked) {
					meatVegetarianCheck.checked = false;
				}
				showCourses(language, courses);
			});
		});

		//Just updates/displays main function when allergies are clicked
		const allergiesTypeFilter = document.querySelector("#allergiesTypeFilter");
		allergiesTypeFilter.onclick = function () {
			showCourses(language, courses);
		};

		//uncheck priceDescending when priceAscending is checked
		priceAscendingCheck.addEventListener("change", function () {
			if (this.checked) {
				priceDescendingCheck.checked = false;
			}
			showCourses(language, courses);
		});

		//Uncheck priceAscending when priceDescending is checked
		priceDescendingCheck.addEventListener("change", function () {
			if (this.checked) {
				priceAscendingCheck.checked = false;
			}
			showCourses(language, courses);
		});
	} catch (error) {
		//Used together with "try", to handle errors that may occur during the execution of the code.
		console.error("Error:", error);
	}
}
fetchCourses(); //calls the whole async function (everything)
