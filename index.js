/*
All my elements
*/
// const form = document.querySelector("form");
const input = document.querySelector("input");
const container = document.querySelector(".container");
const sidebar = document.querySelector("#sidebar");
const searchTitle = document.querySelector("#search-title");
// console.log(input);
input.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    // console.log("e.target.value", e.target.value);
    // console.log("enter key was pressed");
    createWeatherDisplay(e.target.value);
  }
});

var api = "";

// let query = { city: "Sunset Beach", state: "", country: "" };
function getCoords(query, limit) {
  return fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${api}`
  );
}

function currentWeather({ lat, lon }) {
  return fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${api}`
  );
}

var previousSearchHistory = localStorage.getItem("history");
if (previousSearchHistory) {
  previousSearchHistory = JSON.parse(previousSearchHistory);
} else {
  previousSearchHistory = [];
}

for (var i = 0; i < previousSearchHistory.length; i++) {
  let historyBtn = document.createElement("button");
  historyItem = previousSearchHistory[i];
  historyBtn.textContent = historyItem;
  historyBtn.addEventListener("click", function (e) {
    createWeatherDisplay(e.target.textContent);
  });
  sidebar.appendChild(historyBtn);
}

function addToHistory(location) {
  var searchHistory = localStorage.getItem("history");
  if (searchHistory) {
    searchHistory = JSON.parse(searchHistory);
    console.log("logging search history after parse", searchHistory);
    //only push up if it is not included
    if (searchHistory.includes(location)) {
        console.log('early return')
      return;
    }
    console.log('doing da push')
    searchHistory.push(location);
    localStorage.setItem("history", JSON.stringify(searchHistory));
  } else {
    searchHistory = [location];
    localStorage.setItem("history", JSON.stringify(searchHistory));
  }
}

function removeFromHistory(location) {
  var searchHistory = localStorage.getItem("history");
  if (searchHistory) {
    searchHistory = JSON.parse(searchHistory);
    console.log('searchHistory1',searchHistory)
    searchHistory = searchHistory.filter((item) => item !== location);
    console.log('searchHistory2',searchHistory)
    localStorage.setItem("history", JSON.stringify(searchHistory));
  }
}

function createWeatherDisplay(location) {
    
  return getCoords(location, 5)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) {
        // removeFromHistory(location);
        var errorEl = document.createElement("p");
        errorEl.textContent = "No results found";
        document.body.appendChild(errorEl);
      } else {
        searchTitle.textContent = location;
        var { lat, lon } = data[0];
        currentWeather({ lat, lon })
          .then((weatherResponse) => weatherResponse.json())
          .then((weatherData) => {
            // console.log(weatherData);
            var weatherPicture = document.createElement("img");
            weatherPicture.src = `http://openweathermap.org/img/w/${weatherData.current.weather[0].icon}.png`;
            document.body.appendChild(weatherPicture);
            var weatherDescription = document.createElement("p");
            weatherDescription.textContent =
              weatherData.current.weather[0].description;
            document.body.appendChild(weatherDescription);
            addToHistory(location);
          });
      }
    });
}

// createWeatherDisplay("Sunset Beach, CA");

// console.log('', coords);
// currentWeather(coords);

//not sure which way i want to do it yet
//   fetch(
//     `http://api.openweathermap.org/geo/1.0/direct?q=${query.city},${query.state},${query.country}&limit={limit}&appid=${api}`
//   )
