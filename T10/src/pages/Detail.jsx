import "./Detail.css";
import { useCities } from "../contexts/CitiesContext";
import NotFound from "./NotFound";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Weather({ city }) {
    const [weather, setWeather] = useState(null);
    const navigate = useNavigate();

    // TODO: complete me
    // HINT: fetch the city's weather information from Open-Meteo
    useEffect(() => {
        const getWeather = async() => {
            const latitude = city.latitude;
            const longitude = city.longitude;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,precipitation_probability`
            try {
                const response = await fetch(url);
                const result = await response.json();
                setWeather(result.current);
            } catch(error) {
                console.error(error.message);
            }
        }

        getWeather();
    }, []);

    const handle_click = () => {
        navigate("/")
    };

    return <>
        <h1>{city.name}</h1>
        {weather ? <div className="weather-info">
            <div>
                <h3>Temperature</h3>
                <p>{weather.temperature_2m}°C</p>
            </div>
            <div>
                <h3>Humidity</h3>
                <p>{weather.relative_humidity_2m}%</p>
            </div>
            <div>
                <h3>Wind</h3>
                <p className="small">{weather.wind_speed_10m} km/h</p>
            </div>
            <div>
                <h3>Precipitation</h3>
                <p>{weather.precipitation_probability}%</p>
            </div>
        </div> : <div className="spinner"></div>}
        <button className="btn" onClick={handle_click}>Back</button>
    </>;
}

function Detail() {
    const { cities } = useCities();
    const {cityId} = useParams();

    const city = cities.find((c) => c.id == cityId);
    if (!city) {
        return <NotFound />;
    }

    return <Weather city={city} />;
}

export default Detail;