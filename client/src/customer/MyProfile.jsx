import React, { useContext } from 'react';
import { UserContext } from '../App';
import { ImProfile } from "react-icons/im";
import '../css/MyProfile.css';

const MyProfile = () => {
    const user = useContext(UserContext);
    console.log(user);
    if (!user) {
        return <div>Loading...</div>;
    }

    // Displaying user information
    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h1></h1>
                    <h1> <ImProfile /> {user.firstName} {user.lastName} </h1>
                </div>
                <div className="profile-body">
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <p><strong>City:</strong> {user.cityName}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    {/* Add more user details as needed */}
                </div>
            </div>
        </div>
    );
};
export default MyProfile;

