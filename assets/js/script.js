let searchEl = document.querySelector('#search');
let searchBtnEl = document.querySelector('#searchBtn');
let searchHistoryEl = document.querySelector('#searchHistory');
let currentWeatherEl = document.querySelector('#current');
let forecastWeatherEl = document.querySelector('#forecastWrap');

//store the city the user searches into local
var searchHistoryArr = JSON.parse(localStorage.getItem('searchHistory')) || []; 
searchBtnEl.addEventListener('click', function() {
    let city = searchEl.value;
    searchHistoryArr.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArr));
    addBtn();
    searchCity(city);
})

//create a search history list of all places user searches
function addBtn() {
    searchHistoryEl.innerHTML = '';
    searchHistoryArr.forEach(search => {
        let historyBtn = document.createElement('button');
        historyBtn.textContent = search;
        searchHistoryEl.append(historyBtn);
    });
}
addBtn(); //creates search history buttons when page first loads

//take the most current city that the user searches and obtain the lat and long of city
let lat = 33;
let lon = -94;
function searchCity(city) {
    //need a function that finds the city that got searched geo cord and sets the vars to value
}
let requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}.44&lon=${lon}.04&exclude=hourly,minutely&units=imperial&appid=ce8a9858dadfcfb05f86b5d9eedb659d`;

//get the data returned for that city and display the current weather 
fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        //gets the current weather info and adds it to page
        let currentTimezone = data.timezone
        let cityName = (currentTimezone.slice(currentTimezone.indexOf('/')+1));
        currentWeatherEl.innerHTML = `
        <h1>${cityName}<img src='http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png'></h1>
        <p>Temp: ${data.current.temp}°F</p>
        <p>Wind: ${data.current.wind_speed} MPH</p>
        <p>Humidity: ${data.current.humidity} %</p>
        <p>UV Index: ${data.current.uvi}</p>
        `;
        
        //gets the forecasted next 5day weather info and adds it to page
        for (let i=0; i<5;i++) {
            let forecastDayEl = document.createElement('div')
            forecastDayEl.setAttribute('class', 'forecastDay');
            forecastDayEl.innerHTML = `
            <h1>${cityName}<img src='http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png'></h1>
            <p>Temp: ${data.daily[i].temp.day}°F</p>
            <p>Wind: ${data.daily[i].wind_speed} MPH</p>
            <p>Humidity: ${data.daily[i].humidity} %</p>
            `
            forecastWeatherEl.append(forecastDayEl)
        }
      
    
      
      
    });
//display the forecasted weather for next 5 days



