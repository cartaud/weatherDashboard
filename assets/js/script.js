let searchEl = document.querySelector('#search');
let searchBtnEl = document.querySelector('#searchBtn');
let searchHistoryEl = document.querySelector('#searchHistory');
let currentWeatherEl = document.querySelector('#current');
let forecastWeatherEl = document.querySelector('#forecastWrap');

//store the city the user searches into local
var searchHistoryArr = JSON.parse(localStorage.getItem('searchHistory')) || []; 
searchBtnEl.addEventListener('click', function() {
    let city = searchEl.value;
    let locationRequestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=ce8a9858dadfcfb05f86b5d9eedb659d`
    
    searchCity(locationRequestUrl, city);
})

//creates a search history list of all places user searches
function addBtn() {
    searchHistoryEl.innerHTML = '';
    searchHistoryArr.forEach(search => {
        let historyBtn = document.createElement('button');
        historyBtn.setAttribute('class', 'historyBtn');
        historyBtn.textContent = search;
        searchHistoryEl.append(historyBtn);
    });
}
addBtn(); //creates search history buttons when page first loads

//take the most current city that the user searches and obtain the lat and long of city
function searchCity(requestUrl, city) {
    
    fetch(requestUrl)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        if (searchHistoryArr.indexOf(city) < 0 && data.length > 0) {
            searchHistoryArr.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArr));
            addBtn();
        }
        console.log(data)
        let lat = data[0].lat;
        let lon = data[0].lon;
        let cityName = data[0].name;
        let weatherRequestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=ce8a9858dadfcfb05f86b5d9eedb659d`;
        getWeatherInfo(weatherRequestUrl, cityName)
    })
    //need a function that finds the city that got searched geo cord and sets the vars to value
}



//get the data returned for that city and display the current weather 
function getWeatherInfo(requestUrl, city){
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        //gets the current weather info and adds it to page
        let uvStyle;
        if (data.current.uvi > 6) {
            uvStyle = 'red';
        }
        else if (data.current.uvi > 3) {
            uvStyle = 'yellow'
        }
        else {
            uvStyle = 'green'
        }
        currentWeatherEl.innerHTML = `
        <h1>${city} (${moment().format('L')}) <img src='http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png'></h1>
        <p>Temp: ${data.current.temp}°F</p>
        <p>Wind: ${data.current.wind_speed} MPH</p>
        <p>Humidity: ${data.current.humidity} %</p>
        <p>UV Index: <span id="uvNumber" style="background-color: ${uvStyle}">${data.current.uvi}</span></p>
        `;
        
        //gets the forecasted next 5day weather info and adds it to page
        forecastWeatherEl.innerHTML = '';
        for (let i=1; i<=5;i++) {
            let forecastDayEl = document.createElement('div')
            forecastDayEl.setAttribute('class', 'forecastDay');
            forecastDayEl.innerHTML = `
            <h2>${moment().add(i, 'days').format('L')}</h2>
            <img src='http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png'>
            <p>Temp: ${data.daily[i].temp.day}°F</p>
            <p>Wind: ${data.daily[i].wind_speed} MPH</p>
            <p>Humidity: ${data.daily[i].humidity} %</p>
            `
            forecastWeatherEl.append(forecastDayEl)
        }
    });
}





