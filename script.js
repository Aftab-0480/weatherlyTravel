import { climateData } from './climateData.js';

const dislikeRain = document.getElementById("dislikeRain");
const dislikeHumidity = document.getElementById("dislikeHumidity");
const dislikeHeat = document.getElementById("dislikeHeat");
const dislikeCold = document.getElementById("dislikeCold");

const likeRain = document.getElementById("likeRain");
const likeCold = document.getElementById("likeCold");

const preferredTempInput = document.getElementById("preferredTemp");
const monthSelect = document.getElementById("month");
const suggestBtn = document.getElementById("suggestBtn");
const resultBox = document.getElementById("resultBox");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

suggestBtn.addEventListener("click", () => {
  const selectedMonth = parseInt(monthSelect.value);
  const preferredTemp = parseInt(preferredTempInput.value);

  const dislikes = {
    rain: dislikeRain.checked,
    humidity: dislikeHumidity.checked,
    heat: dislikeHeat.checked,
    cold: dislikeCold.checked,
  };

  const likes = {
    rain: likeRain?.checked || false,
    cold: likeCold?.checked || false,
  };

  const atLeastOneDislike = Object.values(dislikes).some(val => val);

  if (!selectedMonth || !atLeastOneDislike) {
    resultBox.innerHTML = "❗ Please select both a travel month and at least one dislike.";
    return;
  }

  resultBox.innerHTML = "🔍 Checking climate data...";
  showToast("Finding the best destinations...");

  const matches = [];

  for (const city in climateData) {
    const monthData = climateData[city][selectedMonth];
    if (!monthData) continue;

    const { temp, humidity, weather } = monthData;
    let penalty = 0;

    if (dislikes.heat && temp >= 30) penalty++;
    if (dislikes.cold && temp <= 16) penalty++;
    if (dislikes.humidity && humidity >= 70) penalty++;
    if (dislikes.rain && weather.includes("rain")) penalty++;

    if (penalty === 0) {
      if (!isNaN(preferredTemp)) {
        if (Math.abs(temp - preferredTemp) <= 3) {
          matches.push({ city, temp, humidity, weather });
        }
      } else {
        matches.push({ city, temp, humidity, weather });
      }
    }
  }

  if (matches.length === 0) {
    resultBox.innerHTML = "❌ No matching cities found. Try changing your preferences.";
    return;
  }

  let html = "<h3>Top Matching Destinations:</h3><ul>";
  for (const place of matches.slice(0, 3)) {
    const icon = getWeatherIcon(place.weather);
    html += `<li>${icon} <strong>${place.city}</strong> – 🌡️ ${place.temp}°C, 💧 ${place.humidity}%, ${place.weather}</li>`;
  }
  html += "</ul>";
  resultBox.innerHTML = html;
});

function getWeatherIcon(condition) {
  condition = condition.toLowerCase();
  if (condition.includes("rain")) return "🌧️";
  if (condition.includes("clear")) return "☀️";
  if (condition.includes("cloud")) return "☁️";
  if (condition.includes("snow")) return "❄️";
  if (condition.includes("haze") || condition.includes("fog")) return "🌫️";
  return "🌤️";
}
