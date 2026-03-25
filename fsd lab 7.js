const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const currentBtn = document.getElementById('current-btn');
const weatherDisplay = document.getElementById('weather-display');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    }
});

currentBtn.addEventListener('click', () => {
    getCurrentLocationWeather();
});

async function getWeatherByCity(city) {
    try {
        // Geocode city to lat/lon
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found');
        }
        const { latitude, longitude, name } = geoData.results[0];
        await getWeather(latitude, longitude, name);
    } catch (error) {
        displayError(error.message);
    }
}

async function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            await getWeather(latitude, longitude, 'Your Location');
        }, (error) => {
            displayError('Unable to get location: ' + error.message);
        });
    } else {
        displayError('Geolocation not supported');
    }
}

async function getWeather(lat, lon, locationName) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&timezone=auto`);
        const data = await response.json();
        displayWeather(data, locationName);
    } catch (error) {
        displayError('Failed to fetch weather data');
    }
}

function displayWeather(data, location) {
    const current = data.current_weather;
    const hourly = data.hourly;
    const temp = current.temperature;
    const weatherCode = current.weathercode;
    const windSpeed = current.windspeed;
    const humidity = hourly.relativehumidity_2m[0]; // current hour

    const icon = getWeatherIcon(weatherCode);
    const description = getWeatherDescription(weatherCode);

    weatherDisplay.innerHTML = `
        <div class="weather-item">
            <div class="weather-icon">${icon}</div>
            <div class="temp">${temp}°C</div>
            <div class="description">${description}</div>
            <div class="location">📍 ${location}</div>
            <div class="details">
                <div class="detail">💨 Wind: ${windSpeed} km/h</div>
                <div class="detail">💧 Humidity: ${humidity}%</div>
            </div>
        </div>
    `;

    // Crazy feature: add rain if raining
    if (weatherCode >= 51 && weatherCode <= 67) {
        addRainEffect();
    } else {
        removeRainEffect();
    }
}

function getWeatherIcon(code) {
    const icons = {
        0: '☀️', // Clear sky
        1: '🌤️', // Mainly clear
        2: '⛅', // Partly cloudy
        3: '☁️', // Overcast
        45: '🌫️', // Fog
        48: '🌫️', // Depositing rime fog
        51: '🌦️', // Drizzle: Light
        53: '🌦️', // Drizzle: Moderate
        55: '🌦️', // Drizzle: Dense
        56: '🌨️', // Freezing Drizzle: Light
        57: '🌨️', // Freezing Drizzle: Dense
        61: '🌧️', // Rain: Slight
        63: '🌧️', // Rain: Moderate
        65: '🌧️', // Rain: Heavy
        66: '🌨️', // Freezing Rain: Light
        67: '🌨️', // Freezing Rain: Heavy
        71: '❄️', // Snow fall: Slight
        73: '❄️', // Snow fall: Moderate
        75: '❄️', // Snow fall: Heavy
        77: '❄️', // Snow grains
        80: '🌧️', // Rain showers: Slight
        81: '🌧️', // Rain showers: Moderate
        82: '🌧️', // Rain showers: Violent
        85: '❄️', // Snow showers slight
        86: '❄️', // Snow showers heavy
        95: '⛈️', // Thunderstorm: Slight or moderate
        96: '⛈️', // Thunderstorm with slight hail
        99: '⛈️'  // Thunderstorm with heavy hail
    };
    return icons[code] || '❓';
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Heavy thunderstorm with hail'
    };
    return descriptions[code] || 'Unknown';
}

function displayError(message) {
    weatherDisplay.innerHTML = `<div class="error">${message}</div>`;
    removeRainEffect();
}

function addRainEffect() {
    let rain = document.querySelector('.rain');
    if (!rain) {
        rain = document.createElement('div');
        rain.className = 'rain';
        document.body.appendChild(rain);
    }
    rain.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.className = 'drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() * 2 + 's';
        rain.appendChild(drop);
    }
}

function removeRainEffect() {
    const rain = document.querySelector('.rain');
    if (rain) {
        rain.remove();
    }
}