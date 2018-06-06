import axios from 'axios';

const rootUrl =  'https://api.openweathermap.org/data/2.5/weather?';
const apiUrl = '&appid=c0b8c5b5962f2fa4a9be20a4100a61e8';

export const getWeatherData = (place) => {
	return axios.get(rootUrl + place + apiUrl);
}

export const getCityImage = (city) => {
	//Replace space with hypehns
	city = city.replace(/\s/g, '-');
	return axios.get(`https://api.teleport.org/api/urban_areas/slug:${city.toLowerCase()}/images/`);
}

export const backgroundStyle = (temp, url) => {
	var backgroundStyle = {};

    if(temp <= 5) {
      backgroundStyle['backgroundImage'] = `linear-gradient(rgba(49,27,146,.7), rgba(49,27,146,.7)), url(${url})`;
    } else if(temp <= 15 && temp > 5) {
      backgroundStyle['backgroundImage'] = `linear-gradient(rgba(26,35,126,.7), rgba(26,35,126,.7)), url(${url})`;
    } else if(temp <= 25 && temp > 15) {
      backgroundStyle['backgroundImage'] = `linear-gradient(rgba(3,169,244,.7), rgba(3,169,244,.7)), url(${url})`;
    } else if(temp <= 35 && temp > 25) {
      backgroundStyle['backgroundImage'] = `linear-gradient(rgba(249,168,37,.7), rgba(249,168,37,.7)), url(${url})`;
    } else if(temp > 35) {
      backgroundStyle['backgroundImage'] = `linear-gradient(rgba(191,54,12,.7), rgba(191,54,12,.7)), url(${url})`;
    } 

    return backgroundStyle;
}
