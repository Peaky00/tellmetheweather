const apiKey = '8862acbd15ecc102a69cce09faa95816';
const searchButton = document.getElementById('search-button');
const temperatureElement = document.getElementById('temperature');
const searchHistory = document.getElementById('search-history');
const weatherDisplay = document.getElementById('weather-display');
const forecastContainer = document.getElementById('forecast');

let searchHistoryList = localStorage.getItem('searchHistoryList') 
    ? JSON.parse(localStorage.getItem('searchHistoryList')) 
    : [];

if (searchHistoryList.length) updateSearchHistory();

async function displayWeatherAndForecast(cityName) {
    try {
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
        const currentWeatherData = await currentWeatherResponse.json();
        
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`);
        const forecastData = await forecastResponse.json();

        const currentTemperature = currentWeatherData.main.temp;
        const currentWeatherDescription = currentWeatherData.weather[0].description;
        displayForecast(forecastData);
        temperatureElement.textContent = `Current Temperature: ${currentTemperature}°C, Description: ${currentWeatherDescription}`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayForecast(forecastData) {
    forecastContainer.innerHTML = '';
    const dailyForecasts = forecastData.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const iconCode = forecast.weather[0].icon;
        const temperatureKelvin = forecast.main.temp;
        const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2);
        const temperatureFahrenheit = ((temperatureKelvin - 273.15) * 9/5 + 32).toFixed(2);
        const windSpeed = forecast.wind.speed;
        const humidity = forecast.main.humidity;
        const dailyForecastContainer = document.createElement('div');
        dailyForecastContainer.classList.add('daily-forecast');
        dailyForecastContainer.innerHTML = `
            <p>Date: ${date.toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
            <p>Temperature (Celsius): ${temperatureCelsius}°C</p>
            <p>Temperature (Fahrenheit): ${temperatureFahrenheit}°F</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <p>Humidity: ${humidity}%</p>
        `;
        forecastContainer.appendChild(dailyForecastContainer);
    });
}

searchHistory.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        const cityName = event.target.textContent;
        displayWeatherAndForecast(cityName);
    }
});

function handleSearch() {
    const cityInput = document.getElementById('city-input');
    const cityName = cityInput.value.trim();
    if (cityName) {
        temperatureElement.textContent = '';
        displayWeatherAndForecast(cityName);
        addToSearchHistory(cityName);
    } else {
        temperatureElement.textContent = 'Please enter a city name.';
    }
}

function addToSearchHistory(cityName) {
    if (!searchHistoryList.includes(cityName)) {
        searchHistoryList.push(cityName);
        localStorage.setItem('searchHistoryList', JSON.stringify(searchHistoryList));
        updateSearchHistory();
    }
}

function updateSearchHistory() {
    searchHistory.innerHTML = '';
    for (const cityName of searchHistoryList) {
        const cityLink = document.createElement('a');
        cityLink.textContent = cityName;
        cityLink.href = '#';
        searchHistory.appendChild(cityLink);
    }
}

searchButton.addEventListener('click', handleSearch);
