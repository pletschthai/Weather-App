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

// Call updateDate initially
updateDate();

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
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
      <div class= dayForecast>
        <div class="weather-forecast-date">${formatDay(forecastDate.dt)}</div>
        <img src="${getIconSrc(
          forecastDate.weather[0].icon
        )}" alt="Clear" id="icon" class="float-left" />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDate.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDate.temp.min
          )}° </span>
        </div>
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
function getIconSrc(iconApi) {
  if (iconApi === "01d") {
    return "openweathermap/01d.svg";
  } else if (iconApi === "01n") {
    return "openweathermap/01n.svg";
  } else if (iconApi === "02n") {
    return "openweathermap/02n.svg";
  } else if (iconApi === "02d") {
    return "openweathermap/02d.svg";
  } else if (iconApi === "03d") {
    return "openweathermap/03d.svg";
  } else if (iconApi === "03n") {
    return "openweathermap/03n.svg";
  } else if (iconApi === "04d") {
    return "openweathermap/04d.svg";
  } else if (iconApi === "04n") {
    return "openweathermap/04n.svg";
  } else if (iconApi === "09d") {
    return "openweathermap/09d.svg";
  } else if (iconApi === "09n") {
    return "openweathermap/09n.svg";
  } else if (iconApi === "10d") {
    return "openweathermap/10d.svg";
  } else if (iconApi === "10n") {
    return "openweathermap/10n.svg";
  } else if (iconApi === "11d") {
    return "openweathermap/11d.svg";
  } else if (iconApi === "11n") {
    return "openweathermap/11n.svg";
  } else if (iconApi === "13d") {
    return "openweathermap/13d.svg";
  } else if (iconApi === "13n") {
    return "openweathermap/13n.svg";
  } else if (iconApi === "50d") {
    return "openweathermap/50d.svg";
  } else if (iconApi === "50n") {
    return "openweathermap/50n.svg";
  }
  return "";
}

function getFormattedTime(timezoneOffset) {
  const utcDate = new Date();
  const utcHours = utcDate.getUTCHours();
  const utcMinutes = utcDate.getUTCMinutes();
  let localHours = utcHours + Math.floor(timezoneOffset / 3600);
  let localMinutes = utcMinutes + Math.floor((timezoneOffset % 3600) / 60);

  if (localHours >= 24) {
    localHours -= 24;
  } else if (localHours < 0) {
    localHours += 24;
  }

  if (localMinutes >= 60) {
    localHours += Math.floor(localMinutes / 60);
    localMinutes %= 60;
  }
  const formattedTime = `${localHours
    .toString()
    .padStart(2, "0")}:${localMinutes.toString().padStart(2, "0")}`;
  return formattedTime;
}

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

  let iconElement = document.querySelector("#icon");
  let iconApi = response.data.weather[0].icon;
  console.log(iconApi);

  iconElement.setAttribute("src", getIconSrc(iconApi));
  iconElement.setAttribute("alt", response.data.weather[0].description);

  document.querySelector("#sunrise").innerHTML = formatSun(
    response.data.sys.sunrise
  );
  document.querySelector("#sunset").innerHTML = formatSun(
    response.data.sys.sunset
  );
  document.querySelector("#hour").innerHTML = getFormattedTime(
    response.data.timezone
  );
  const formattedTimezone = getFormattedTime(response.data.timezone);
  timeBackground(formattedTimezone);
  getForecast(response.data.coord);
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
function timeBackground(time) {
  let backgroundVideo = document.querySelector("#background-video");

  let currentHour = time.split(":")[0];

  if (currentHour >= 6 && currentHour < 7) {
    backgroundVideo.setAttribute("src", "images/sunrise.mp4");
  } else if (currentHour >= 7 && currentHour < 12) {
    backgroundVideo.setAttribute("src", "images/morning.mp4");
  } else if (currentHour >= 12 && currentHour < 16) {
    backgroundVideo.setAttribute("src", "images/afternoon.mp4");
  } else if (currentHour >= 16 && currentHour < 19) {
    backgroundVideo.setAttribute("src", "images/sunset.mp4");
  } else if (currentHour >= 19 && currentHour < 21) {
    backgroundVideo.setAttribute("src", "images/evening.mp4");
  } else {
    backgroundVideo.setAttribute("src", "images/night.mp4");
  }
}
timeBackground(`${new Date().getHours()}:${new Date().getMinutes()}`);
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
