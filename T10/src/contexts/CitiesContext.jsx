import { createContext, useContext, useState, useRef } from "react";

const CitiesContext = createContext();

export const CitiesProvider = ({ children }) => {
    const [cities, setCities] = useState([
        { id: 1, name: "Toronto", latitude: 43.70011, longitude: -79.4163 }
    ]);
    const nextCityId = useRef(2);

    const addCity = (name, latitude, longitude) => {
        const newCity = {
            id: nextCityId.current++,
            name,
            latitude,
            longitude
        };
        setCities((prevCities) => [...prevCities, newCity]);
    };

    const removeCity = (cityId) => {
        setCities(cities.filter((city) => city.id !== cityId));
    };

    return (
        <CitiesContext.Provider value={{ cities, addCity, removeCity }}>
            {children}
        </CitiesContext.Provider>
    );
};

export const useCities = () => {
    return useContext(CitiesContext);
};
