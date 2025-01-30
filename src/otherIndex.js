import "./styles.css";
import weatherIcons from "./icons";
import { format } from "date-fns";

//--------------------------------
//     WEATHER API HANDLING
//--------------------------------

async function getWeather(location = "madrid", unit = "metric") {
  try {
    const data = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&key=LZSJQYYC6AWFNBWYJETNVFUHM`,
    );
    const info = await data.json();

    return {
      location: info.resolvedAddress.split(",")[0],
      country: info.resolvedAddress.split(",").pop().trim(),
      currentConditions: {
        temp: info.currentConditions.temp,
        feelsLike: info.currentConditions.feelslike,
        conditions: info.currentConditions.conditions,
        icon: info.currentConditions.icon,
      },
      days: {
        0: {
          dayOfWeek: format(new Date(info.days[0].datetime), "EEEE"),
          date: format(new Date(info.days[0].datetime), "dd MMM"),
          conditions: info.days[0].conditions,
          tempMax: Math.floor(info.days[0].tempmax),
          tempMin: Math.floor(info.days[0].tempmin),
          icon: info.days[0].icon,
        },
        1: {
          dayOfWeek: format(new Date(info.days[1].datetime), "EEEE"),
          date: format(new Date(info.days[1].datetime), "dd MMM"),
          conditions: info.days[1].conditions,
          tempMax: Math.floor(info.days[1].tempmax),
          tempMin: Math.floor(info.days[1].tempmin),
          icon: info.days[1].icon,
        },
        2: {
          dayOfWeek: format(new Date(info.days[2].datetime), "EEEE"),
          date: format(new Date(info.days[2].datetime), "dd MMM"),
          conditions: info.days[2].conditions,
          tempMax: Math.floor(info.days[2].tempmax),
          tempMin: Math.floor(info.days[2].tempmin),
          icon: info.days[2].icon,
        },
        3: {
          dayOfWeek: format(new Date(info.days[3].datetime), "EEEE"),
          date: format(new Date(info.days[3].datetime), "dd MMM"),
          conditions: info.days[3].conditions,
          tempMax: Math.floor(info.days[3].tempmax),
          tempMin: Math.floor(info.days[3].tempmin),
          icon: info.days[3].icon,
        },
      },
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    showError();
    return getCity().then(getWeather);
  }
}

//--------------------------------
//        IP API HANDLING
//--------------------------------

async function getCity() {
  const ipData = await fetch("https://ipinfo.io/json?token=d0371dd1f9210d");
  const jsonData = await ipData.json();

  return `${jsonData.city}, ${jsonData.region}, ${jsonData.country}`;
}

//--------------------------------
//        DOM MANIPULATION
//--------------------------------

let unit = "metric";
let currentLocation;

// Query Selectors
const Selector = (function () {
  return {
    body: document.querySelector("body"),
    unitWrapper: document.getElementById("unit-wrapper"),
    metricSelector: document.getElementById("metric-selector"),
    imperialSelector: document.getElementById("imperial-selector"),
    form: document.querySelector("form"),
    currentBtn: document.getElementById("current-location"),
    location: document.getElementById("location"),
    currentIcon: document.getElementById("current-icon"),
    currentTemp: document.getElementById("current-temp"),
    currentConditions: document.getElementById("current-conditions"),
    currentFeelsLike: document.getElementById("current-feels-like"),
    days: {
      0: {
        icon: document.getElementById("0-icon"),
        temp: document.getElementById("0-temp"),
        conditions: document.getElementById("0-conditions"),
      },
      1: {
        icon: document.getElementById("1-icon"),
        temp: document.getElementById("1-temp"),
        conditions: document.getElementById("1-conditions"),
      },
      2: {
        day: document.getElementById("2-day"),
        icon: document.getElementById("2-icon"),
        temp: document.getElementById("2-temp"),
        conditions: document.getElementById("2-conditions"),
      },
      3: {
        day: document.getElementById("3-day"),
        icon: document.getElementById("3-icon"),
        temp: document.getElementById("3-temp"),
        conditions: document.getElementById("3-conditions"),
      },
    },
  };
})();

// Render the weather on screen
function renderWeather(obj) {
  Selector.body.dataset.style = obj.currentConditions.icon;
  Selector.location.textContent = `${obj.location}, ${obj.country}`;
  Selector.currentIcon.src = weatherIcons[obj.currentConditions.icon];
  if (obj.currentConditions.temp % 1 !== 0) {
    Selector.currentTemp.innerHTML = `${obj.currentConditions.temp.toString().split(".")[0]}<span>.${obj.currentConditions.temp.toString().split(".")[1]}</span>º`;
  } else {
    Selector.currentTemp.textContent = `${obj.currentConditions.temp}º`;
  }
  Selector.currentConditions.textContent = obj.currentConditions.conditions;
  Selector.currentFeelsLike.textContent = `Feels like ${obj.currentConditions.feelsLike}º`;

  Selector.days[0].icon.src = weatherIcons[obj.days[0].icon];
  Selector.days[0].temp.textContent = `${obj.days[0].tempMin}º | ${obj.days[0].tempMax}º`;
  Selector.days[0].conditions.textContent = obj.days[0].conditions;

  Selector.days[1].icon.src = weatherIcons[obj.days[1].icon];
  Selector.days[1].temp.textContent = `${obj.days[1].tempMin}º | ${obj.days[1].tempMax}º`;
  Selector.days[1].conditions.textContent = obj.days[1].conditions;

  Selector.days[2].day.textContent = obj.days[2].dayOfWeek;
  Selector.days[2].icon.src = weatherIcons[obj.days[2].icon];
  Selector.days[2].temp.textContent = `${obj.days[2].tempMin}º | ${obj.days[2].tempMax}º`;
  Selector.days[2].conditions.textContent = obj.days[2].conditions;

  Selector.days[3].day.textContent = obj.days[3].dayOfWeek;
  Selector.days[3].icon.src = weatherIcons[obj.days[3].icon];
  Selector.days[3].temp.textContent = `${obj.days[3].tempMin}º | ${obj.days[3].tempMax}º`;
  Selector.days[3].conditions.textContent = obj.days[3].conditions;
}

// Render screen during loading
function renderLoading() {
  Selector.location.textContent = "...";
  Selector.currentTemp.textContent = "...";
  Selector.currentConditions.textContent = "...";
  Selector.currentFeelsLike.textContent = "...";

  Selector.days[0].temp.textContent = "...";
  Selector.days[0].conditions.textContent = "...";

  Selector.days[1].temp.textContent = "...";
  Selector.days[1].conditions.textContent = "...";

  Selector.days[2].day.textContent = "...";
  Selector.days[2].temp.textContent = "...";
  Selector.days[2].conditions.textContent = "...";

  Selector.days[3].day.textContent = "...";
  Selector.days[3].temp.textContent = "...";
  Selector.days[3].conditions.textContent = "...";
}

// Change the value of currentLocation
function updateLocation(location) {
  currentLocation = location;
}

// Search form behavior
function searchWeather(e) {
  e.preventDefault();
  if (Selector.form["search-box"].value) {
    renderLoading();
    updateLocation(Selector.form["search-box"].value);
    getWeather(currentLocation, unit).then(renderWeather);
  }
}

// Current location behavior
function searchCurrentLocation() {
  Selector.form.reset();
  renderLoading();
  getCity()
    .then(updateLocation)
    .then(() => getWeather(currentLocation, unit).then(renderWeather));
}

// Unit toggle behavior
function changeUnit(e) {
  const target = e.target.closest(".unit-selector");
  if (
    target === Selector.metricSelector &&
    !Selector.metricSelector.classList.contains("unit-selected")
  ) {
    unit = "metric";
    Selector.metricSelector.classList.toggle("unit-selected", true);
    Selector.imperialSelector.classList.toggle("unit-selected", false);
    getWeather(currentLocation, unit).then(renderWeather);
  } else if (
    target === Selector.imperialSelector &&
    !Selector.imperialSelector.classList.contains("unit-selected")
  ) {
    unit = "us";
    Selector.imperialSelector.classList.toggle("unit-selected", true);
    Selector.metricSelector.classList.toggle("unit-selected", false);
    getWeather(currentLocation, unit).then(renderWeather);
  }
}

function showError() {
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-message");
  errorMessage.textContent =
    "Oops, we could not find that location. Showing your estimated current location instead";
  Selector.body.appendChild(errorMessage);

  setTimeout(() => {
    errorMessage.classList.add("hidden");
  }, 3000);

  setTimeout(() => {
    errorMessage.remove();
  }, 4000);
}

//--------------------------------
//        EVENT LISTENERS
//--------------------------------

Selector.form.addEventListener("submit", searchWeather);
Selector.currentBtn.addEventListener("click", searchCurrentLocation);
document.addEventListener("DOMContentLoaded", () => {
  renderLoading();
  getWeather(currentLocation, unit).then(renderWeather);
});
Selector.unitWrapper.addEventListener("click", changeUnit);
