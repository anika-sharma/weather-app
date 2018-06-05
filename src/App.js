import React, { Component } from 'react';
import Autocomplete from './components/PlacesAutocomplete';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import NotificationBar from './components/NotificationBar/';
import * as utils from './utils.js';
import 'weather-icons/css/weather-icons.min.css';
import './App.css';


let latLng = {}, place = '';

class App extends Component {
  constructor() {
    super();

    this.state = {
      query: '',
      name: '',
      weather: '',
      temp: 0,
      humidity: 0,
      wind: '',
      conditions: '',
      backgroundImage: '',
      offline: false
    }
  }

  componentWillMount() {
    if(localStorage.getItem('latLng')) {
      latLng = JSON.parse(localStorage.getItem('latLng'));
      //Display stored data
      place = `lat=${latLng.lat}&lon=${latLng.lng}`;
      //Get Weather Data
      utils.getWeatherData(place)
      .then((response) => {
        this.updateWeatherData(response.data);
        //Get City Image
        utils.getCityImage(response.data.name)
        .then((response) => {
          //Set Background Image
          this.setState({
            backgroundImage: response.data.photos[0].image.web
          })
        })
        .catch((error) => {
          console.log(error);
        })
      })
      .catch((error) => {
        console.log(error);
      });

    } else {
      //Display default data and set state
      place = `lat=40.7127753&lon=-74.0059728`;
      utils.getWeatherData(place)
      .then((response) => {
        //Get weather data
        this.updateWeatherData(response.data);
        //Get city image
        utils.getCityImage(response.data.name)
        .then((response) => {
          //Set Background Image
          this.setState({
            backgroundImage: response.data.photos[0].image.web
          })
        })
        .catch((error) => {
          console.log(error);
        })
      })
      .catch((error) => {
        console.log(error);
      });

      //Set default value in local storage
      localStorage.setItem('latLng', JSON.stringify({lat: 40.7127753, lng: -74.0059728}));
    }

    //Refresh weather data every 5 minutes
    setInterval((function() {
      this.refreshWeatherData();
    }).bind(this), 300000);
  }

  //Handle Change of PlacesAutocomplete
  handleChange = (query) => {
    this.setState({ query })
  };

  //On select of place
  handleSelect = (query) => {
    this.setState({ query });

    geocodeByAddress(query)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        //Set place and latitude, longitude value
        place = `lat=${latLng.lat}&lon=${latLng.lng}`;
        latLng = {lat: latLng.lat, lng: latLng.lng};
        //Get weather data
        utils.getWeatherData(place)
        .then((response) => {
          //Update weather data
          this.updateWeatherData(response.data);

          //Set Background Image
          utils.getCityImage(response.data.name)
          .then((response) => {
            //Set Background Image
            this.setState({
              backgroundImage: response.data.photos[0].image.web
            })
          })
          .catch((error) => {
            console.log(error);
          });

          //Update latLng value in local storage
          localStorage.setItem('latLng', JSON.stringify({lat: latLng.lat, lng: latLng.lng}));
        })
        .catch((error) => {
          console.log(error);
        })
      })
      .catch(error => console.error(error))
  };

  refreshWeatherData = () => {
    utils.getWeatherData(place)
    .then((response) => {
      this.updateWeatherData(response.data);
      localStorage.setItem('latLng', JSON.stringify({lat: latLng.lat, lng: latLng.lng}));
    })
    .catch((error) => {
      console.log(error);
    })
  };

  updateWeatherData = (weatherData) => {
    this.setState({
      name: weatherData.name,
      weather: weatherData.weather[0].id,
      temp: Math.round(weatherData.main.temp - 273.15),
      humidity: Math.round(weatherData.main.humidity),
      wind: Math.round(weatherData.wind.speed),
      conditions: weatherData.weather[0].main
    })
  }

  render() {
    return (
      <div className="container">
        {this.state.offline ?  <NotificationBar /> : null}
        <h1>Weather App</h1>

        <Autocomplete
          query={this.state.query}
          handleChange={this.handleChange.bind(this)}
          handleSelect={this.handleSelect.bind(this)} />

      <article 
        className="weather-card" 
        style={utils.backgroundStyle(this.state.temp, this.state.backgroundImage)}>

        <h3 className="conditions">{this.state.conditions}</h3>
        <h6 className="city">{this.state.name}</h6>

        <div className="weather-icon-block">
          <i className={'weather-icon wi wi-owm-' + this.state.weather}></i>
        </div>

        <div className="temperature">
          {this.state.temp}
          <span className="wi wi-degrees"></span>
        </div>

        <section>
          <div className="weather-details">
            <p>
              <i className="wi wi-umbrella"></i>
              <span>{' ' + this.state.humidity + '%'}</span>
              <i className="wi wi-windy"></i>
              <span>{' ' + this.state.wind + ' Km/h'}</span>
            </p>
          </div>
        </section>

      </article>
    </div>
    );
  }
}

export default App;
