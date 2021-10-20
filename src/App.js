// Import the dependencies
import "./App.css";
import React from "react";
import Loader from "react-loader-spinner";

// API Key: 250 calls/mo
const API_KEY = "a43ce4ace26a5c1187516e1e4dae242d";

// helpers
function getReleventInfo(data) {
  const { 
    location: { name, country, region, localtime, lat, lon },
    current: { temperature, weather_icons, weather_descriptions, wind_speed, wind_degree, wind_dir, pressure, humidity, cloud_clover, feelslike, is_day } 
  } = data;
  
  const weatherData = { name, country, region, localtime, lat, lon, temperature, weather_icons, weather_descriptions, wind_speed, wind_degree, wind_dir, pressure, humidity, cloud_clover, feelslike, is_day };

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
  async getWeatherData(query) {
    this.setState({ loading: true })
    query = query.replace(/ /g, "%20");
    const response = await fetch(`http://api.weatherstack.com/current?access_key=${API_KEY}&query=${query}`)
    const data = await response.json();
    const { error } = data;
    if (error) {
      this.setState({ loading: false, weatherData: {}, error: "Something went wrong" });
    } else {
      const weatherData = getReleventInfo(data);
      this.setState({ loading: false, weatherData });
    }
  }

  async getCurrentCity() {
    const response = await fetch("http://ip-api.com/json");
    const data = await response.json();
    const currentCity = await data.city;
    return currentCity;
  }

  // Function Binding
  getWeatherData = this.getWeatherData.bind(this);

  // Lifecycle methods
  async componentDidMount() {
    const currentCity = await this.getCurrentCity();
    await this.getWeatherData(currentCity);
    console.log(this.state.weatherData);
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
            <h1 className="regionName">{data.region}</h1>
            <h1 className="countryName">{data.country}</h1>
          </div>
          <div className="divider" />
          <div className="basicDetails">
            <div className="circularContainer">
              <h1 className="temperature">{data.temperature}{"\u02da"}C</h1>
            </div>
            <div className="descriptions">
              {data.weather_descriptions && data.weather_descriptions.map(desc => (
                <h2 className="description">{desc}</h2>
              ))}
              {data.weather_icons && data.weather_icons.map(url => (
                <img className="icon" src={url} alt={"icon"} />
              ))}
            </div>
          </div>
          <div className="details">
            <table>
              <tr><th>Date:</th><td>{new Date(data.localtime).toDateString("en-US")}</td></tr>
              <tr><th>Observed At:</th><td>{new Date(data.localtime).toLocaleTimeString("en-US")}</td></tr>
              <tr><th>Geolocation:</th><td>{`${data.lat}, ${data.lon}`}</td></tr>
              <tr><th>Wind Speed:</th><td>{data.wind_speed}m/s</td></tr>
              <tr><th>Wind Degree:</th><td>{data.wind_degree}{"\u02da"}</td></tr>
              <tr><th>Wind Direction:</th><td>{data.wind_dir}</td></tr>
              <tr><th>Pressure:</th><td>{data.pressure}Pa</td></tr>
              <tr><th>Humidity:</th><td>{data.humidity}%</td></tr>
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
