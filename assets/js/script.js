//targets specified html elements 
let searchEl = document.querySelector('#search');
let searchBtnEl = document.querySelector('#searchBtn');
let searchHistoryEl = document.querySelector('#searchHistory');
let currentWeatherEl = document.querySelector('#current');
let forecastWeatherEl = document.querySelector('#forecastWrap');

//store the city the user searches into local
var searchHistoryArr = JSON.parse(localStorage.getItem('searchHistory')) || []; 
searchBtnEl.addEventListener('click', startSearch) //when blue search button get clicked, 

//Begins are search when user clicks any button in the searchWrap element
function startSearch(e) {
    
    let city; 
    if (e.target.value != 'inputValue') { //If user clicks any of the search history buttons, this will run
        city = e.target.value
    }
    else { //If the user clicks the blue search button, the text in the textarea is used as search parameter 
        let inputText = searchEl.value.toLowerCase().split(' '); //this turns the users entered text into title case 
        for (let i=0; i<inputText.length;i++){
            inputText[i] = inputText[i].charAt(0).toUpperCase() + inputText[i].slice(1);
        }
        city = inputText.join(' ');
    }//link to geocoding API with the city value that was chosen above as a parameter 
    let locationRequestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=ce8a9858dadfcfb05f86b5d9eedb659d`
    searchEl.value = ''; //clears text in text area 
    searchCity(locationRequestUrl);
}

//take the most current city that the user searches and obtain the lat and long of city
function searchCity(requestUrl) {
    fetch(requestUrl)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        let cityName = data[0].name; //gets the first city returned in search from API
        if (searchHistoryArr.indexOf(cityName) < 0 && data.length > 0) { //this makes sure there are no repeated search history buttons
            searchHistoryArr.push(cityName);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArr));
            addBtn();
        }
        let lat = data[0].lat;  //gets the latitude and longitude of the city returned by API
        let lon = data[0].lon;
        //Adds the lat and lon values to weather API url so we can find the weather in the city we are searching for
        let weatherRequestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=ce8a9858dadfcfb05f86b5d9eedb659d`;
        getWeatherInfo(weatherRequestUrl, cityName)
    })
    //need a function that finds the city that got searched geo cord and sets the vars to value
}

//creates a search history list of all places user searches
function addBtn() {
    searchHistoryEl.innerHTML = '';
    searchHistoryArr.forEach(search => { //loops through each value in our local history array
        let historyBtn = document.createElement('button');
        historyBtn.setAttribute('class', 'historyBtn');
        historyBtn.setAttribute('value', `${search}`);//assigns a value to each button equal to the text (city name)
        historyBtn.textContent = search;
        searchHistoryEl.append(historyBtn);
    });
    let historyBtns = document.querySelectorAll('.historyBtn');
    historyBtns.forEach(historyBtn => { //adds event listeners to all history buttons
        historyBtn.addEventListener('click', startSearch)
    })
}
addBtn(); //creates search history buttons when page first loads

//get the data returned for that city and display the current weather 
function getWeatherInfo(requestUrl, city){
    fetch(requestUrl) //fetches weather data on the location specified by the lat and lon   
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        
        let uvStyle; //depending on UV value, the background color changes color for high medium and low values
        if (data.current.uvi >= 6) {
            uvStyle = 'red';
        }
        else if (data.current.uvi >= 3) {
            uvStyle = '#e2e200'
        }
        else {
            uvStyle = 'green'
        }
        //template that adds all of our desired weather data to the page
        currentWeatherEl.innerHTML = `
        <h1>${city} (${moment().format('L')}) <img src='https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png'></h1>
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
            <h3>${moment().add(i, 'days').format('L')}</h3>
            <img src='https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png'>
            <p>Temp: ${data.daily[i].temp.day}°F</p>
            <p>Wind: ${data.daily[i].wind_speed} MPH</p>
            <p>Humidity: ${data.daily[i].humidity} %</p>
            `
            forecastWeatherEl.append(forecastDayEl)
        }
    });
}





