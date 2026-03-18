import './City.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContext';

const City = ({ city }) => {
    const [temperature, setTemperature] = useState(null);
    const navigate = useNavigate();
    const {removeCity} = useCities();

    useEffect(() => {
        const getTemperature = async() => {
            const latitude = city.latitude
            const longitude = city.longitude
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            try {
                const response = await fetch(url);
                const result = await response.json();
                setTemperature(result.current_weather.temperature);
            } catch (error) {
                console.error(error.message);
            }
        }

        getTemperature();
    }, []);

    // TODO: complete me
    // HINT: fetch the current temperature of the city from Open-Meteo

    const handle_click = () => {
        navigate(`/${city.id}`)
    };

    return (
        <div className="city-card">
            <button className="remove-btn" onClick={() => removeCity(city.id)}>×</button>
            <div className="city-content" onClick={handle_click}>
                <h2>{city.name}</h2>
                {temperature !== null ? (
                    <p className="temperature">{temperature}°C</p>
                ) : (
                    <div className="spinner"></div>
                )}
            </div>

        </div>
    );
};

export default City;