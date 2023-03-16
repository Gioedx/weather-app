//API key
var apiKey = "5d2554024ac2cfe790cc23c3c0dceb24";

//Search process
document.getElementById("search-button").onclick = search;
searchHistory = JSON.parse(localStorage.getItem("historySearch"))
if (searchHistory){
    for (var index = 0; index < searchHistory.length; index++) {
        const element = searchHistory[index];
        createBtn(element)        
    }
    localStorage.clear();
}

//City info or allow pop up
function search(event) {
    event.preventDefault();    
    var city = document.getElementById("search-input").value; 
    if (city.length > 0){  
    geoCode(city)
    createBtn(city)
    }
    else {
        alert("Please enter a valid city")
    }
}

function createBtn(city) {
    var addBtn = document.createElement("button");
    var listElement = document.querySelector("#history");
    addBtn.addEventListener("click", function () {
        
        geoCode(city);
});

    listElement.append(addBtn);
    addBtn.type = "button";
    addBtn.classList.add("btn-custom");
    addBtn.textContent = city;
    const cityList = JSON.parse(localStorage.getItem("historySearch"));
    if (cityList){
        cityList.push(city);
        localStorage.setItem("historySearch", JSON.stringify(cityList));
    }
    else {   
        let array = []
        array.push(city)
    localStorage.setItem("historySearch", JSON.stringify(array));
    } 
}

function geoCode(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`).then(response => response.json()).then(function (cityOutput) {
            var cityLocation = cityOutput[0]
            forecast(cityLocation)
            current(cityLocation)
        });
}

function current(data){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=${apiKey}&units=metric`).then(response => response.json()).then(function (currentWeather) {
        var todaysWeather = document.querySelector('#today')
        var todayDate = moment.unix(currentWeather.dt).format("DD/MM/YYYY")
        todaysWeather.innerHTML = `<div class="card" style="width:100%; height:100%;">
        <img class="card-img-top" src='https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png' style="height:150px; width:150px;">
        <div class="card-body">
        <h4 class="card-title"> ${currentWeather.name}</h4>
        <p class="card-text"> Date: ${todayDate}</p>
        <p class="card-text">Temperature: ${currentWeather.main.temp} °C</p>
        <p class="card-text">Wind: ${currentWeather.wind.speed} KPH</p>         
        <p class="card-text">Humidity: ${currentWeather.main.humidity} %</p>
        </div>`
    });
}


function forecast(data) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.lat}&lon=${data.lon}&appid=${apiKey}&units=metric`).then(response => response.json()).then(function (fiveDaysOutput) {
        var fiveDaysWeather = document.querySelector("#forecast")                    
        fiveDaysWeather.textContent = " ";
        
        for (var i = 1;  i < 40; i++) {  
            var date = moment.unix(fiveDaysOutput.list[i].dt).format("DD/MM/YYYY")
            fiveDaysWeather.innerHTML += `<div class="card" style="width:205px">
            <img class="card-img-top" src='https://openweathermap.org/img/wn/${fiveDaysOutput.list[i].weather[0].icon}@2x.png'>
            <div class="card-body">
            <p class="card-text">Date: ${date}</p>           
            <p class="card-text">Temperature: ${fiveDaysOutput.list[i].main.temp} °C</p>
            <p class="card-text">Wind: ${fiveDaysOutput.list[i].wind.speed} KPH</p>
            <p class="card-text">Humidity: ${fiveDaysOutput.list[i].main.humidity} %</p>
            </div>`                          
            i+=7
        } 
    });
}