// Import the dependencies
import "./App.css";
import React from "react";
import Loader from "react-loader-spinner";

// API Key: 250 calls/mo
const API_KEY = "23756992e06787aa9225e9b361dfcd66";

// helpers
function getReleventInfo(data) {
  const { 
    name,
    sys: { country },
    coord: { lat, lon },
    weather,
    main: { temp, pressure, humidity },
    visibility,
    wind: { speed: wind_speed, deg: wind_deg },
  } = data;

  const { main, icon } = weather[0];

  const weatherData = { name, country, lat, lon, temp, icon, main, visibility, wind_speed, wind_deg, pressure, humidity, localtime: new Date() };

  return weatherData;
}

class Weather extends React.Component {
  
  constructor(props) {
    super(props);

    // State
    this.state = {
      loading: true,
      weatherData: {},
      error: ""
    }
  }

  // handlers
  async getWeatherData() {
    this.setState({ loading: true })
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
        const data = await response.json();
        const { error } = data;
        if (error) {
          this.setState({ loading: false, weatherData: {}, error: "Something went wrong" });
        } else {
          const weatherData = getReleventInfo(data);
          this.setState({ loading: false, weatherData });
        }
      }
    )}
  };

  // Function Binding
  getWeatherData = this.getWeatherData.bind(this);

  // Lifecycle methods
  async componentDidMount() {
    await this.getWeatherData();
  }

  // Render the UI
  render() {

    const { weatherData: data, loading } = this.state;

    if (loading) {
      return (
        <div className="background">
          <Loader
            type="TailSpin"
            color="#FF0"
            height={100}
            width={100}
          />
        </div>
      );
    }
    return (
      <div className="background">
        <div className="container">
          <div className="location">
            <h1 className="cityName">{data.name}</h1>
            <h1 className="countryName">{data.country}</h1>
          </div>
          <div className="divider" />
          <div className="basicDetails">
            <div className="circularContainer">
              <h1 className="temperature">{Math.round(data.temp)}{"\u02da"}C</h1>
            </div>
            <div className="descriptions">
              <h2 className="description">{data.main}</h2>
              <img className="icon" src={`http://openweathermap.org/img/wn/${data.icon}@2x.png`} alt={"icon"} />
            </div>
          </div>
          <div className="details">
            <table>
              <tbody>
                <tr><th>Date:</th><td>{data.localtime.toDateString("en-US")}</td></tr>
                <tr><th>Observed At:</th><td>{data.localtime.toLocaleTimeString("en-US")}</td></tr>
                <tr><th>Geolocation:</th><td>{`${data.lat}, ${data.lon}`}</td></tr>
                <tr><th>Wind Speed:</th><td>{data.wind_speed}m/s</td></tr>
                <tr><th>Wind Degree:</th><td>{data.wind_deg}{"\u02da"}</td></tr>
                <tr><th>Pressure:</th><td>{data.pressure}Pa</td></tr>
                <tr><th>Humidity:</th><td>{data.humidity}%</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div>
      <Weather />
    </div>
  )
}

export default App;
