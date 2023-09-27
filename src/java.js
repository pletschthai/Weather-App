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

//Weather API

function showTemperature(response) {
  console.log(response);

  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;

  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);

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

// Changing temperature by clicking on the link
function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let temperature = temperatureElement.innerHTML;
  console.log(temperature);
  temperatureElement.innerHTML = Math.round((temperature * 9) / 5 + 32);
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let temperature = temperatureElement.innerHTML;
  console.log(temperature);
  temperatureElement.innerHTML = Math.round((temperature - 32) * (5 / 9));
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);
