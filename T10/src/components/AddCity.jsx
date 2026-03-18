import './AddCity.css';
import { forwardRef, useState } from "react";
import { useCities } from '../contexts/CitiesContext';

const AddCity = forwardRef(({ setError }, ref) => {
    const [cityName, setCityName] = useState("");
    const { addCity } = useCities();

    const handle_submit = async (e) => {
        e.preventDefault();

        const trimmedCityName = cityName.trim();

        if (!trimmedCityName) {
            setError("City name cannot be blank.");
            return;
        }

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmedCityName)}&limit=1`;

        try {
            const response = await fetch(url, {
                headers: {
                    "Accept": "application/json"
                }
            });

            const result = await response.json();

            if (!result || result.length === 0) {
                setError(`City '${trimmedCityName}' is not found.`);
                return;
            }

            const topResult = result[0];
            addCity(trimmedCityName, parseFloat(topResult.lat), parseFloat(topResult.lon));
            setError("");
            setCityName("");
            ref.current?.close();
        } catch (error) {
            console.error(error.message);
            setError(`City '${trimmedCityName}' is not found.`);
        }
    };

    return (
        <dialog ref={ref}>
            <div className="dialog-header">
                <span>Add A City</span>
                <a onClick={() => ref.current?.close()}>✖</a>
            </div>

            <form onSubmit={handle_submit}>
                <input
                    type="text"
                    placeholder="Enter City Name"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    required
                />
                
                <div className="button-group">
                    <button type="submit">Add</button>
                    <button type="button" onClick={() => ref.current?.close()}>
                        Close
                    </button>
                </div>
            </form>
        </dialog>
    );
});

export default AddCity;
