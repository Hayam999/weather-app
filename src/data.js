import { format } from "date-fns";
import { Selector } from "./index.js";

// fetch data from Visual Crossing Weather API
async function search(city, unit) {
  const key = "WUSXR36FAW4KZQLWUE27XCC8T";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=${key}`;
  try {
    const info = await fetch(url, { mode: "cors" });
    if (!info.ok) {
      throw new Error(`HTTP error! status: ${info.status}`);
    }
    const data = await info.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

// get weather information for a city
async function getWeatherInfo(city = "cairo", unit = "metric") {
  try {
    const info = await search(city, unit);
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
    console.log(err);
    showError();
    return getCity().then(getWeatherInfo);
  }
}
async function getCity() {
  const ipData = await fetch("https://ipinfo.io/json?token=d0371dd1f9210d");
  const jsonData = await ipData.json();

  return `${jsonData.city}, ${jsonData.region}, ${jsonData.country}`;
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

export { getWeatherInfo, getCity };
