// Select the form and input
const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");

// Select weather card elements
const weatherCard = document.getElementById("weatherCard");
const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temp");
const feelsEl = document.getElementById("feelsLike");
const conditionEl = document.getElementById("condition");
const windEl = document.getElementById("wind");
const humidEl = document.getElementById("humid");

// Fetch weather data from API
function fetchWeather(city) {
  const url = `https://wttr.in/${city}?format=j1`;
  console.log("Fetching weather data for:", city);
  return fetch(url).then(res => res.json());
}

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();
  if (!city) {
    console.log("No city entered.");
    return;
  }

  console.log("Submitting form for city:", city);

  fetchWeather(city)
    .then(data => {
      const current = data.current_condition[0];

      cityNameEl.textContent = city;
      tempEl.textContent = current.temp_C;
      feelsEl.textContent = current.FeelsLikeC;
      conditionEl.textContent = current.weatherDesc[0].value;
      windEl.textContent = current.windspeedKmph;
      humidEl.textContent = current.humidity;

      weatherCard.classList.remove("hidden");
      console.log("Weather card updated and shown.");
    })
    .catch(() => {
      console.log("Failed to fetch weather data.");
    });
});
