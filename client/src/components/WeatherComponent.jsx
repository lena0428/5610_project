import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './WeatherCard';


const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [latitude, setLatitude] = useState('51.5085')
  const [longitude, setLongitude] = useState('-0.1257')


  // 1. get latitude and longitude
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [latitude, longitude]);

  useEffect(() => {
    // 2. get nearby weather station id
    const fetchNearbyStations = async () => {
      const options = {
        method: 'GET',
        url: 'https://meteostat.p.rapidapi.com/stations/nearby',
        params: {
          lat: latitude,
          lon: longitude
        },
        headers: {
          'X-RapidAPI-Key': 'f2dc06b8b7msh8800a56db0ad226p1cad50jsn359eee85b495',
          'X-RapidAPI-Host': 'meteostat.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        return response.data.data[0].id;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    // 3. get daily weather 
    const fetchWeatherData = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);

          try {
            const stationId = await fetchNearbyStations();
            if (!stationId) {
              console.error('Failed to fetch station ID.');
              return;
            }

            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            const options = {
              method: 'GET',
              url: 'https://meteostat.p.rapidapi.com/stations/daily',
              params: {
                station: stationId,
                start: formattedDate,
                end: formattedDate,
                tz: userTimeZone
              },
              headers: {
                'X-RapidAPI-Key': 'f2dc06b8b7msh8800a56db0ad226p1cad50jsn359eee85b495',
                'X-RapidAPI-Host': 'meteostat.p.rapidapi.com'
              }
            };

            const response = await axios.request(options);
            setWeatherData(response.data);
          } catch (error) {
            console.error(error);
          }
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div>
      {weatherData ? (
        <div>
          <WeatherCard weatherData={weatherData}></WeatherCard>
        </div>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  );
};

export default WeatherComponent;
