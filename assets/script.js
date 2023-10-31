document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeatherData(city);
        saveToSearchHistory(city);
    }
});

function fetchWeatherData(city) {
    const apiKey = 'f6a66d05e74d6041359bb66bbc990422';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for current weather: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.cod !== 200) {
                throw new Error('Error fetching current weather: ' + data.message);
            }
            displayCurrentWeather(data);

            const lat = data.coord.lat;
            const lon = data.coord.lon;
            const futureWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            return fetch(futureWeatherUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for future weather: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.cod !== "200") {
                throw new Error('Error fetching future weather: ' + data.message);
            }
            displayFutureWeather(data);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}





function displayCurrentWeather(data) {
    if (data.cod !== 200) {
        console.error('Error fetching current weather:', data.message);
        return;
    }

    const currentWeatherDiv = document.getElementById('current-weather');
    currentWeatherDiv.innerHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p><img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon"></p>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity} %</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}


function displayFutureWeather(data) {
    const futureWeatherDiv = document.getElementById('future-weather');
    futureWeatherDiv.innerHTML = '<h2>5-Day Forecast</h2>';
    
    for (let i = 1; i <= 5; i++) {
        const futureWeather = data.list[i * 8 - 1];
        futureWeatherDiv.innerHTML += `
            <div class="forecast">
                <p>Date: ${new Date(futureWeather.dt * 1000).toLocaleDateString()}</p>
                <p><img src="http://openweathermap.org/img/w/${futureWeather.weather[0].icon}.png" alt="Weather Icon"></p>
                <p>Temperature: ${futureWeather.main.temp} °C</p>
                <p>Humidity: ${futureWeather.main.humidity} %</p>
                <p>Wind Speed: ${futureWeather.wind.speed} m/s</p>
            </div>
        `;
    }
}


function saveToSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    updateSearchHistoryDisplay();
}

function updateSearchHistoryDisplay() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchHistoryDiv = document.getElementById('search-history');
    searchHistoryDiv.innerHTML = '<h3>Search History</h3>';
    searchHistory.forEach(city => {
        searchHistoryDiv.innerHTML += `<button onclick="fetchWeatherData('${city}')">${city}</button>`;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateSearchHistoryDisplay();
});
