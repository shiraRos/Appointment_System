import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/MyMessages.css';
import { useNavigate } from 'react-router-dom';

const MyMessages = () => {
    const [messages, setMessages] = useState([]);
    const [allRead, setAllRead] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:8080/messages');
                const fetchedMessages = response.data;
                setMessages(fetchedMessages);

                const unreadMessages = fetchedMessages.filter(message => message.isRead === 0);
                setAllRead(unreadMessages.length === 0);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, []);

    const handleDetailsClick = (businessName) => {
        navigate(`../searchBusinessOwner`, {  replace: true, state: { name: businessName } });
        // navigate(`searchBusinessOwner?businessName=${businessName}`);
    };

    return (
        <div className="messages-container">
            <h1 className="titleMessage">Messages</h1>
            {allRead && <div>Wonderful!! You've read all the messages.</div>}
            <table className="messages-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Business</th>
                        <th>Professional</th>
                        <th>Title</th>
                        <th> Business Details</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map(message => (
                        <tr key={message.messageCode}>
                            <td>{message.message_date}</td>
                            <td>{message.customer_name}</td>
                            <td>{message.business_name}</td>
                            <td>{message.professional_name}</td>
                            <td className="tooltip">
                                {message.title}
                                <span className="tooltiptext">{message.content}</span>
                            </td>
                            <td>
                                <button id="moreDetails" onClick={() => handleDetailsClick(message.business_name)}>
                                    Business Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyMessages;
