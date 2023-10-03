// Global variables
const apiKey = '8862acbd15ecc102a69cce09faa95816';
const searchButton = document.getElementById('search-button');
const temperatureElement = document.getElementById('temperature');
const searchHistory = document.getElementById('search-history');
const weatherDisplay = document.getElementById('weather-display');
const forecastContainer = document.getElementById('forecast'); // Container for forecast data
let searchHistoryList = []; // Declare searchHistoryList as a global variable

// Function to fetch and display both current weather and 5-day forecast
async function displayWeatherAndForecast(cityName) {
    try {
        // Fetch current weather data
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
        const currentWeatherData = await currentWeatherResponse.json();
        
        // Fetch 5-day forecast data
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`);
        const forecastData = await forecastResponse.json();

        // Process and display the current weather
        const currentTemperature = currentWeatherData.main.temp;
        const currentWeatherDescription = currentWeatherData.weather[0].description;
        // Display other current weather data as needed

        // Process and display the 5-day forecast (as shown in previous answers)
        displayForecast(forecastData);

        // Display the current weather and forecast in the UI
        temperatureElement.textContent = `Current Temperature: ${currentTemperature}°C, Description: ${currentWeatherDescription}`;
        // Display other current weather data as needed

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Function to display the 5-day forecast data (daily)
function displayForecast(forecastData) {
    // Clear any previous forecast data
    forecastContainer.innerHTML = '';

    // Filter the forecast data to include only daily data points
    const dailyForecasts = forecastData.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

    // Loop through the daily forecast data and create containers for each day's data
    dailyForecasts.forEach(forecast => {
        // Extract relevant data from the daily forecast
        const date = new Date(forecast.dt * 1000); // Convert timestamp to date
        const iconCode = forecast.weather[0].icon; // Weather icon code
        const temperatureKelvin = forecast.main.temp;
        const temperatureCelsius = (temperatureKelvin - 273.15).toFixed(2); // Convert to Celsius
        const temperatureFahrenheit = ((temperatureKelvin - 273.15) * 9/5 + 32).toFixed(2); // Convert to Fahrenheit
        const windSpeed = forecast.wind.speed;
        const humidity = forecast.main.humidity;

        // Create a container for the daily forecast data
        const dailyForecastContainer = document.createElement('div');
        dailyForecastContainer.classList.add('daily-forecast');

        // Create elements to display daily forecast data
        dailyForecastContainer.innerHTML = `
            <p>Date: ${date.toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
            <p>Temperature (Celsius): ${temperatureCelsius}°C</p>
            <p>Temperature (Fahrenheit): ${temperatureFahrenheit}°F</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <p>Humidity: ${humidity}%</p>
            <!-- Add more forecast data here as needed -->
        `;

        // Append the daily forecast container to the forecast container
        forecastContainer.appendChild(dailyForecastContainer);
    });
}

// Event listener for saved search items
searchHistory.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        const cityName = event.target.textContent;
        displayWeatherAndForecast(cityName);
    }
});

// Function to handle search button click
function handleSearch() {
    const cityInput = document.getElementById('city-input');
    const cityName = cityInput.value.trim();

    if (cityName) {
        // Clear any previous error message
        temperatureElement.textContent = '';

        // Fetch current weather and forecast for the city
        displayWeatherAndForecast(cityName);

        // Update the search history
        addToSearchHistory(cityName);
    } else {
        // Display an error message
        temperatureElement.textContent = 'Please enter a city name.';
    }
}

// Function to add a city to the search history
function addToSearchHistory(cityName) {
    // Check if the city is already in the search history
    if (!searchHistoryList.includes(cityName)) {
        searchHistoryList.push(cityName);
        updateSearchHistory();
    }
}

// Function to update the search history display
function updateSearchHistory() {
    // Clear the previous search history HTML
    searchHistory.innerHTML = '';

    // Loop through the search history array and create links for each city
    for (const cityName of searchHistoryList) {
        const cityLink = document.createElement('a');
        cityLink.textContent = cityName;
        cityLink.href = '#';
        searchHistory.appendChild(cityLink);
    }
}

// Attach event listener to the search button
searchButton.addEventListener('click', handleSearch);
