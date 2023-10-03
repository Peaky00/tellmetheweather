document.addEventListener('DOMContentLoaded', function() {
    // Your JavaScript code here
});

const apiKey = '8862acbd15ecc102a69cce09faa95816';
const searchButton = document.getElementById('search-button');
const temperatureElement = document.getElementById('temperature');
const searchHistory = document.getElementById('search-history');
const weatherDisplay = document.getElementById('weather-display');
let searchHistoryList = [];

// Function to fetch weather data from an API (e.g., OpenWeatherMap)
async function getWeatherData(cityName) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
        const data = await response.json();
        
        // Process and display the weather data
        const temperature = data.main.temp;
        temperatureElement.textContent = `Temperature: ${temperature}°C`;

        // Update the search history
        searchHistoryList.push(cityName);
        updateSearchHistory();

        // You can add more code here to display other weather information
    } catch (error) {
        console.error('Error fetching weather data:', error);
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
        cityLink.href = '#'; // You can add an event handler to handle clicking on a city
        searchHistory.appendChild(cityLink);
    }
}

// Function to handle search button click
function handleSearch() {
    const cityInput = document.getElementById('city-input');
    const cityName = cityInput.value.trim();
    const errorMessageElement = document.getElementById('error-message');

    // Clear any previous error message
    errorMessageElement.textContent = '';

    if (cityName) {
        // Fetch weather data for the city
        getWeatherData(cityName);
    } else {
        // Display an error message
        errorMessageElement.textContent = 'Please enter a city name.';
    }
}

// Attach event listener to the search button
searchButton.addEventListener('click', handleSearch);