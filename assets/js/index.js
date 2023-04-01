/*
All my elements
*/
// const form = document.querySelector("form");
const input = document.querySelector("#searchBar");
const inputButton = document.querySelector("#searchButton");
const container = document.querySelector(".container");
const sidebar = document.querySelector("#sidebar");
const searchTitle = document.querySelector("#search-title");
const currentWeatherDesc = document.querySelector("#weather-description-1");
const currentWeatherIcon = document.querySelector("#weather-icon");
const title1 = document.querySelector("#section-title-1");
const title2 = document.querySelector("#section-title-2");
const clearHistory = document.querySelector("#clear-history");
const historyContainer = document.querySelector("#history-container");

currentWeatherIcon.style.visibility = "hidden";
title1.style.visibility = "hidden";
title2.style.visibility = "hidden";

clearHistory.addEventListener("click", function () {
  localStorage.clear();
  historyContainer.innerHTML = "";
});

input.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    createWeatherDisplay(e.target.value);
  }
});

inputButton.addEventListener("click", function (e) {
  createWeatherDisplay(input.value);
});


var api = "3f4554a91084dec34b04a8262ea01949";

// let query = { city: "Sunset Beach", state: "", country: "" };
function getCoords(query, limit) {
  return fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${api}`
  );
}

function currentWeather({ lat, lon }) {
  return fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${api}&units=imperial`
  );
}

function fiveDayForecast({ lat, lon }) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api}&units=imperial`
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
  historyBtn.style.width = "100%";
  historyContainer.appendChild(historyBtn);
}

function addToHistory(location) {
  var searchHistory = localStorage.getItem("history");
  if (searchHistory) {
    searchHistory = JSON.parse(searchHistory);

    if (searchHistory.includes(location)) {
      return;
    }
    let historyBtn = document.createElement("button");
    historyBtn.textContent = location;
    historyBtn.addEventListener("click", function (e) {
      createWeatherDisplay(e.target.textContent);
    });

    historyBtn.style.width = "100%";
    historyContainer.appendChild(historyBtn);
    console.log("container", historyContainer);

    searchHistory.push(location);
    localStorage.setItem("history", JSON.stringify(searchHistory));
  } else {
    let historyBtn = document.createElement("button");
    historyBtn.textContent = location;
    historyBtn.addEventListener("click", function (e) {
      createWeatherDisplay(e.target.textContent);
    });

    historyBtn.style.width = "100%";
    historyContainer.appendChild(historyBtn);
    console.log("container", historyContainer);
    searchHistory = [location];
    localStorage.setItem("history", JSON.stringify(searchHistory));
  }
}

function removeFromHistory(location) {
  var searchHistory = localStorage.getItem("history");
  if (searchHistory) {
    searchHistory = JSON.parse(searchHistory);

    searchHistory = searchHistory.filter((item) => item !== location);

    localStorage.setItem("history", JSON.stringify(searchHistory));
  }
}

function createWeatherDisplay(location) {
  return getCoords(location, 5)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) {
        var errorEl = document.createElement("p");
        errorEl.textContent = "No results found";
        document.body.appendChild(errorEl);
      } else {
        const currentDate = new Date(); // create a new Date object
        const dateString = currentDate.toDateString(); // convert the date to a string

        searchTitle.textContent = location + ": " + dateString;
        var { lat, lon } = data[0];
        currentWeather({ lat, lon })
          .then((weatherResponse) => weatherResponse.json())
          .then((weatherData) => {
            if (currentWeatherIcon.style.visibility === "hidden") {
              currentWeatherIcon.style.visibility = "visible";
              title1.style.visibility = "visible";
              title2.style.visibility = "visible";
            }

            currentWeatherIcon.src = `http://openweathermap.org/img/w/${weatherData.current.weather[0].icon}.png`;

            currentWeatherDesc.innerText = `Temperature: ${weatherData.current.temp}°F \nFeels Like: ${weatherData.current.feels_like}°F\nHumidity: ${weatherData.current.humidity}%\nWind Speed: ${weatherData.current.wind_speed}mph\nDescription: ${weatherData.current.weather[0].description}  
              `;
            weatherData.current.weather[0].description;
            // currentWeatherDesc.appendChild(weatherDescription);
            addToHistory(location);
          });

        fiveDayForecast({ lat, lon })
          .then((fiveDayResponse) => fiveDayResponse.json())
          .then((fiveDayData) => {
            const fiveDayForecastEl =
              document.querySelector("#five-day-forecast");
            fiveDayForecastEl.innerHTML = "";
            for (var i = 0; i < fiveDayData.list.length; i += 8) {
              const day = fiveDayData.list[i];
              const dayEl = document.createElement("div");
              dayEl.setAttribute("class", "day");
              const dayDate = new Date(day.dt * 1000);
              const dayDateStr = dayDate.toDateString();
              dayEl.innerHTML = `
                <h3 class="weather-description">${dayDateStr}</h3>
                <img src="http://openweathermap.org/img/w/${day.weather[0].icon}.png" />
                <p class="weather-description">Temp: ${day.main.temp}°F</p>
                <p class="weather-description">Humidity: ${day.main.humidity}%</p>
              `;
              fiveDayForecastEl.appendChild(dayEl);
            }
          });
      }
    });
}
