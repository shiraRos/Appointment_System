import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/InviteDate.css';

const InviteDate = () => {
    const [queues, setQueues] = useState([]);
    const [loading, setLoading] = useState(true);
    const { state } = useLocation()


    // useEffect(() => {
    //     if (state && state.name) {
    //         setSearchTerm(state.name)
    //         handleSearch()


    //     }
    // }, [])


    useEffect(() => {
        // Fetch queue data from the server
        axios.get('http://localhost:8080/queues')
            .then(response => {
                setQueues(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching queue data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div id="loading">Loading...</div>;
    }

    return (
        <div id="queue-list">
            <button id="back-button">Back</button>
            <h2 id="sort-title">Sort by Date:</h2>
            <table id="queue-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Duration</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Hour</th>
                        <th>Book Appointment</th>
                    </tr>
                </thead>
                <tbody>
                    {queues.map((queue, index) => (
                        <tr key={index}>
                            <td>{queue.customerName}</td>
                            <td>{queue.phone}</td>
                            <td>{queue.duration}</td>
                            <td>{queue.price}</td>
                            <td>{queue.date}</td>
                            <td>{queue.hour}</td>
                            <td><button className="book-button">Book Appointment</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InviteDate;
