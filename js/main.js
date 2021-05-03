// DOM Elements
const time = document.getElementById('time'),
    date = document.getElementById('date'),
    greeting = document.getElementById('greeting'),
    name = document.getElementById('name'),
    focus = document.getElementById('focus'),
    body = document.querySelector('body'),
    btn_img = document.getElementById('btn_img'),
    quote = document.getElementById('quote'),
    btn_quote = document.getElementById('btn_quote'),
    city = document.getElementById('city'),
    weather_Icon = document.querySelector('.weather-icon'),
    temperature = document.getElementById('temperature'),
    weather_Description = document.getElementById('weather-description'),
    weather_Wind = document.getElementById('weather-wind'),
    weather_Humidity = document.getElementById('weather-humidity');

    arr_month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    arr_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];

let curr_text,
    base,
    curr_image = Math.floor(Math.random() * 20);
    cur_quote = Math.floor(Math.random() * 10);


//Show Time
function showTime() {
    let today = new Date(),
        hour = today.getHours(),
        min = today.getMinutes(),
        seconds = today.getSeconds(),
        dayWeek = today.getDay(),
        day = today.getDate(),
        month = today.getMonth();

    time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(seconds)}`;
    date.innerHTML = `${arr_week[dayWeek]}<span>, </span>${day} ${arr_month[month]}`;
    setTimeout(showTime, 1000);
}

//Add Zeros
function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

//Set Background and Greeting
function setBgGreet() {
    let today = new Date();
    let hour = today.getHours();

    if((hour > 6) && (hour < 12)){
        base = "./images/morning/";
        greeting.textContent = 'Good Morning,';
    } else if((hour >= 12) && (hour < 18)) {
        base = "./images/day/";
        greeting.textContent = 'Good Afternoon,';
    } else if((hour >= 18) && (hour < 24)){
        base = "./images/evening/";
        greeting.textContent = 'Good Evening,';
        document.body.style.color = 'white';
    } else {
        base = "./images/night/";
        greeting.textContent = 'Good Night,';
        document.body.style.color = 'white';
    }
    getImage();
    setTimeout(setBgGreet, 1000 * 60 * 60);
}

function viewBgImage(src) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        body.style.backgroundImage = `url(${src})`;
    };
}

//Get Image
function getImage() {
    const index = curr_image % images.length;
    const imageSrc = base + images[index];
    viewBgImage(imageSrc);
    curr_image++;
    btn_img.disabled = true;
    setTimeout(function() { btn_img.disabled = false }, 1000);
}

//Get Name
function getName() {
    if(localStorage.getItem('name') === null){
        name.textContent = '[Enter Name]';
    } else{
        name.textContent = localStorage.getItem('name');
    }
}

//Set Name
function setName(e) {
    if(e.type === 'keypress'){

        // Make sure enter is pressed
        if(e.which === 13 || e.keyCode === 13) {
            localStorage.setItem('name', e.target.innerText);
            name.blur();
        }
    } else {
        if(name.innerHTML === ''){
            e.target.innerText = curr_text;
        }
        localStorage.setItem('name', e.target.innerText)
    }
}

//Get Focus
function getFocus(){
    if(localStorage.getItem('focus') === null){
        focus.textContent = '[Enter Focus]';
    } else{
        focus.textContent = localStorage.getItem('focus');
    }
}

//Set Focus
function setFocus(e) {
    if (e.type === 'keypress') {
        // Make sure enter is pressed
        if (e.which === 13 || e.keyCode === 13) {
            localStorage.setItem('focus', e.target.innerText);
            focus.blur();
        }
    } else {
        if(focus.innerHTML === ''){
            e.target.innerText = curr_text;
        }
        localStorage.setItem('focus', e.target.innerText)
    }
}

//Get City
function getCity(){
    if(localStorage.getItem('city') === null){
        city.textContent = '[Enter city]';
    } else{
        city.textContent = localStorage.getItem('city');
        getWeather();
    }
}

//Set City
function setCity(e) {
    if (e.type === 'keypress') {
        // Make sure enter is pressed
        if (e.which === 13 || e.keyCode === 13) {
            localStorage.setItem('city', e.target.innerText);
            city.blur();
            getWeather();
        }
    } else {
        if(city.innerHTML === ''){
            e.target.innerText = curr_text;
        }
        localStorage.setItem('city', e.target.innerText)
    }
}

async function getQuote() {
    const url = `https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand`,
        res = await fetch(url),
        data = await res.json(),
        index = cur_quote % data.length;
    cur_quote++;
    quote.innerHTML = data[index].content.rendered;
}

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=8f7f9ad34de8fd92b46edc3f3b93678d&units=metric`;
    const res = await fetch(url);
    if (!res.ok) {
        weather_Icon.className = 'weather-icon owf';
        city.textContent = 'Incorrect city name';
        temperature.innerHTML = ``;
        weather_Description.textContent =  ``;
        weather_Humidity.innerHTML = ``;
        weather_Wind.innerHTML = ``;
        return;
    }
    const data = await res.json();

    //Print results
    weather_Icon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    weather_Description.textContent = data.weather[0].description;
    weather_Wind.textContent='wind: '+data.wind.speed+' m/s';
    weather_Humidity.textContent='humidity: '+data.main.humidity+'%';

}

//Run
showTime();
setBgGreet();
getName();
getFocus();
getQuote();
getCity();

document.addEventListener('DOMContentLoaded', getWeather);

name.addEventListener('click', () => {
    curr_text = name.innerHTML;
    name.innerHTML = '';
})
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);

focus.addEventListener('click', () => {
    curr_text = focus.innerHTML;
    focus.innerHTML = '';
})
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);

city.addEventListener('click', () => {
    curr_text = city.innerHTML;
})
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);

btn_img.addEventListener('click', getImage);
btn_quote.addEventListener('click', getQuote);

