function updateDate() {
  var currentDate = new Date();
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  var formattedDate = currentDate.toLocaleDateString(undefined, options);
  document.getElementById("date").textContent = formattedDate;
}

function updateHour() {
  let hourElement = document.querySelector("#hour");
  let currentHour = new Date();
  let getHours = currentHour.getHours();
  let minutes = currentHour.getMinutes();

  // Add leading zeros to minutes if necessary
  let minutesStr = minutes.toString().padStart(2, "0");

  hourElement.innerHTML = getHours + ":" + minutesStr;
}
// Call updateDate initially
updateDate();
updateHour();

// Update the date every second
setInterval(updateDate, 1000);

//Forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row mt-3">`;
  forecast.forEach(function (forecastDate, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDate.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDate.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDate.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDate.temp.min
          )}° </span>
        </div>
      </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  console.log(forecastHTML);
}

// Changing the City by using the Search Bar
let apiUrl = "";

function search(city) {
  let apiKey = "c76db1bd2c2a808bab15d20555e59a59";
  let units = "metric";
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}
function changeCity(event) {
  event.preventDefault();
  let city = document.querySelector("#cityInput").value;
  search(city);
}
//Formatting sunrise and sunset
function formatSun(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}
//Weather API

function showTemperature(response) {
  console.log(response);
  celsiusTemperature = response.data.main.temp;
  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;

  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  let description = document.querySelector("#weatherDescription");
  description.innerHTML = response.data.weather[0].description;

  let windSpeed = document.querySelector("#windSpeed");
  let wind = response.data.wind.speed;
  windSpeed.innerHTML = `Wind: ${wind} km/h`;

  let humidityElement = document.querySelector("#humidity");
  let humidity = response.data.main.humidity;
  humidityElement.innerHTML = `Humidity: ${humidity}%`;

  let feelsLike = document.querySelector("#feelsLike");
  let apTemp = Math.round(response.data.main.feels_like);
  feelsLike.innerHTML = `Feels Like: ${apTemp}°C`;

  let precipitation = document.querySelector("#precipitation");
  let apRain = Math.round(response.data.main.precipitation);
  precipitation.innerHTML = `Precipitation: ${apRain}%`;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
  updateIcon(response.data.weather[0].icon);
  document.querySelector("#sunrise").innerHTML = formatSun(
    response.data.sys.sunrise
  );
  document.querySelector("#sunset").innerHTML = formatSun(
    response.data.sys.sunset
  );
}

// Forecast coordinates.

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "7059cb165caa3316bff682d263a01b1e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
//Search Button
let searchCity = document.querySelector("#searchCity");
searchCity.addEventListener("submit", changeCity);

//Initial City in the page:

search("San Francisco");

//Using the geolocation for current location
function searchLocation(position) {
  let apiKey = "c76db1bd2c2a808bab15d20555e59a59";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showTemperature);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
//Geolocation - Current location button
let currentLocationButton = document.querySelector("#geolocationPin");
currentLocationButton.addEventListener("click", getCurrentLocation);

//Changing the background video depending on the time
function timeBackground() {
  let backgroundVideo = document.getElementById("background-video");

  let currentDate = new Date();
  let currentHour = currentDate.getHours();

  if (currentHour >= 6 && currentHour < 7) {
    backgroundVideo.setAttribute("src", "/images/sunrise.mp4");
  } else if (currentHour >= 7 && currentHour < 12) {
    backgroundVideo.setAttribute("src", "/images/morning.mp4");
  } else if (currentHour >= 12 && currentHour < 17) {
    backgroundVideo.setAttribute("src", "/images/afternoon.mp4");
  } else if (currentHour >= 17 && currentHour < 19) {
    backgroundVideo.setAttribute("src", "/images/sunset.mp4");
  } else if (currentHour >= 19 && currentHour < 0) {
    backgroundVideo.setAttribute("src", "/images/evening.mp4");
  } else {
    backgroundVideo.setAttribute("src", "/images/night.mp4");
  }

  window.onload = timeBackground;
}

// Changing temperature by clicking on the link

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let temperature = temperatureElement.innerHTML;
  console.log(temperature);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  temperatureElement.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

// Mapping of openweathermap condition codes to custom icon filenames
const iconFolder = "icons/all";
const iconMapping = {
  "01d": "clear-day.svg",
  "01n": "clear-night.svg",
  "02d": "partly-cloudy-day.svg",
  "02n": "partly-cloudy-night.svg",
  "03d": "cloudy.svg",
  "03n": "cloudy.svg",
  "04d": "cloudy.svg",
  "04n": "cloudy.svg",
  "09d": "rain.svg",
  "09n": "rain.svg",
  "10d": "partly-cloudy-day-rain.svg",
  "10n": "partly-cloudy-night-rain.svg",
  "11d": "thunderstorms.svg",
  "11n": "thunderstorms.svg",
  "13d": "partly-cloudy-day-snow.svg",
  "13n": "partly-cloudy-night-snow.svg",
  "50d": "mist.svg",
  "50n": "mist.svg",
};

function updateIcon(response) {
  const iconElement = document.querySelector("#icon");
  const conditionCode = response.weather[0].icon;
  const customIconFilename = iconMapping[conditionCode] || "default-icon.svg";
  iconElement.setAttribute("src", `${iconFolder}${customIconFilename}`);
}
