import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/InviteQueue.css';

const InviteQueue = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchField, setSearchField] = useState('');
    const [searchSecondaryField, setSearchSecondaryField] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [cities, setCities] = useState([]);

    useEffect(() => {
        // Fetch cities from the server
        axios.get('http://localhost:8080/api/cities')
            .then(response => {
                setCities(response.data);
            })
            .catch(error => {
                console.error('Error fetching cities:', error);
            });

        // Fetch businesses from the server
        axios.get('http://localhost:8080/api/businesses')
            .then(response => {
                setBusinesses(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching business data:', error);
                setLoading(false);
            });
    }, []);

    const filteredBusinesses = businesses.filter(business => {
        return (
            business.business_name.toLowerCase().includes(searchField.toLowerCase()) &&
            business.secondary_field.toLowerCase().includes(searchSecondaryField.toLowerCase()) &&
            (selectedCity === '' || business.cityName === selectedCity) &&
            (selectedRating === '' || business.rating === selectedRating)
        );
    });

    if (loading) {
        return <div id="loading">Loading...</div>;
    }

    return (
        <div id="invite-queue">
            <div id="search-section">
                <div id="search-criteria">
                    <p>Search for a business that suits you:</p>
                    <input 
                        type="text" 
                        placeholder="Field" 
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Secondary field" 
                        value={searchSecondaryField}
                        onChange={(e) => setSearchSecondaryField(e.target.value)}
                    />
                </div>
                <div id="additional-options">
                    <p>Additional filtering options:</p>
                    <ul>
                        <li>
                            City: 
                            <select 
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                <option value="">All</option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city.CityName}>{city.CityName}</option>
                                ))}
                            </select>
                        </li>
                        <li>
                            Rating: 
                            <select 
                                value={selectedRating}
                                onChange={(e) => setSelectedRating(e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </li>
                    </ul>
                </div>
            </div>
            <h2 id="list-title">List of relevant businesses:</h2>
            <table id="business-table">
                <thead>
                    <tr>
                        <th>Business Name</th>
                        <th>Phone</th>
                        <th>City</th>
                        <th>Rating</th>
                        <th>More Details</th>
                        <th>Book Appointment</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBusinesses
                //     .filter(data =>
                //  (!x || x == data.x) && 
                //  (!Y || Y == data.Y) &&
                //  (!c || c <=data.c) &&
                //  (!f || data.f.includes(f)))
                 .map((business, index) => (
                        <tr key={index}>
                            <td>{business.business_name}</td>
                            <td>{business.phone}</td>
                            <td>{business.cityName}</td>
                            <td>{business.rating}</td>
                            <td><button className="details-button">More Details</button></td>
                            <td><button className="book-button">Book Appointment</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InviteQueue;
