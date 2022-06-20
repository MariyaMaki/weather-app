const apikey = `29ce1736788c172d0887ac281f088845`;

//fonction pour avoir les 5 éléments de l'app
function displayWeatherhtml(day, index) {
  let logoUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
  let dayName = getDayName(index);
  const div = document.createElement("div");
  div.innerHTML = `<span class="jour">${dayName}</span>
    <span class="logo"><img src="${logoUrl}" alt="" /></span>
    <span class="tempMin">${day.temp.min}°</span>
    <span class="tempMax">${day.temp.max}°</span>`;
  document.querySelector("#dayOfWeek").appendChild(div);
}

//fonction qui retourne le tableau avec les noms des jours en fonction de la langue
function getWeekDays(locale) {
  let baseDate = new Date(Date.UTC(2017, 0, 2)); // just a Monday
  let weekDays = [];
  for (i = 0; i < 7; i++) {
    weekDays.push(baseDate.toLocaleDateString(locale, { weekday: "long" }));
    baseDate.setDate(baseDate.getDate() + 1);
  }
  return weekDays;
}

//fonction qui retourne le nom du jour
function getDayName(index) {
  let weekDays = getWeekDays("fr-Be");
  const currentDay = new Date().getDay();
  let DayIndex = currentDay - 1 + index;
  return weekDays[DayIndex < 7 ? DayIndex : DayIndex - 7];
}

//avoir nom de la ville
function getCityName() {
  try {
    let city = document.getElementById("cityInput").value;

    //si pas le nom de la ville cela envoie une erreur
    if (city === "") {
      throw "Please enter a city";
    }
    return city;
  } catch (error) {
    throw error;
  }
}

//fonction pour avoir la latitude et la longitude
async function getLatLonFromCity(city) {
  try {
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=29ce1736788c172d0887ac281f088845`;
    let response = await fetch(url);
    let data = await response.json();

    //si c'est une ville qui n'existe pas
    if (data.cod === "404") {
      throw data.message;
    }

    return data.coord;
  } catch (error) {
    throw error;
  }
}

//fonction qui récupère toutes les données de l'API
async function apiCallWeatherAPI() {
  try {
    let city = getCityName(); //si erreur ce qui est en dessous n'est pas pris en compte et direct alerte erreur
    let coord = await getLatLonFromCity(city);

    url = ` https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&units=metric&lang=en&exclude=minutely,alerts&appid=${apikey}`;
    response = await fetch(url);
    return await response.json();
  } catch (error) {
    alert(error);
  }
}

// Message erreur bouton search
const btn_search = document.getElementById("btn_search");
btn_search.addEventListener("click", async () => {
  try {
    let data = await apiCallWeatherAPI();
    for (let i = 0; i < 5; i++) {
      displayWeatherhtml(data.daily[i], i);
    }
  } catch (error) {
    alert(error);
  }
});

//Message erreur buton enter
document.addEventListener("keyup", async (e) => {
  if (e.key === "Enter") {
    try {
      let data = await apiCallWeatherAPI();
      for (let i = 0; i < 5; i++) {
        displayWeatherhtml(data.daily[i], i);
      }
    } catch (error) {
      alert(error);
    }
  }
});
