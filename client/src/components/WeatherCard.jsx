import React from 'react';
import moment from 'moment';
import '../style/weathercard.css'

const WeatherCard = ({ weatherData }) => (
  <div className="main">
    <p className="header">Weather</p>
    <div className="flex">
      <p className="day">Day: {moment().format('dddd')}</p>
      <p className="day">{moment().format('LL')}</p>
    </div>

    <div className="flex">
      <p className="temp">Avg Temprature: {weatherData.data[0].tavg} &deg;C</p>
      <p className="temp">Avg Wind Speed: {weatherData.data[0].wspd} km/h </p>
    </div>

  </div>
)

export default WeatherCard;