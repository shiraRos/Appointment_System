
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import '../css/register.css';
import Swal from 'sweetalert2';

const RegisterCustomer = (props) => {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [formUserData, setFormUserData] = useState({
        idCustomer: '',
        firstName: '',
        lastName: '',
        address: '',
        city: { cityCode: '', cityName: '' },
        email: '',
        passwordCust: '',
        confirmPassword: ''
    });
    const [cities, setCities] = useState([]);

    useEffect(() => {
        // Fetch cities from the server
        axios.get("http://localhost:8080/cities")
            .then(response => {
                setCities(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the cities!", error);
            });
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormUserData((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleCityChange = (event) => {
        const selectedCity = cities.find(city => city.CityCode === parseInt(event.target.value));
        setFormUserData((prevUser) => ({
            ...prevUser,
            city: {
                cityCode: selectedCity.CityCode,
                cityName: selectedCity.CityName
            }
        }));
    };

    const handleSubmitRegister = (event) => {
        event.preventDefault();
        const errors = validate(formUserData);
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            axios.post("http://localhost:8080/customers", formUserData)
                .then((response) => {
                    if (response.status === 201) {
                        const userContextData = {
                            idCustomer: formUserData.idCustomer,
                            firstName: formUserData.firstName,
                            lastName: formUserData.lastName,
                            email: formUserData.email,
                            cityCode: formUserData.city.cityCode,
                            cityName: formUserData.city.cityName,
                            address: formUserData.address,
                            phone: formUserData.phone
                        };
                        console.log("userContextData ", userContextData);
                        props.updateUserContext(userContextData);
                        // alert('register successful');
                        Swal.fire({
                            icon: 'success',
                            title: 'register Successful',
                            text: `Welcome, ${formUserData.firstName}!`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        navigate(`/customerMenu/${formUserData.firstName}`);
                    }
                    else {
                        console.error('Error adding user:', response.statusText);
                    }
                })
                .catch((error) => {
                    console.error('Error in handleSubmit:', error);
                });
        } else {
            alert(Object.values(errors).join("\n"));
        }
    };

    const validate = (values) => {
        const errors = {};
        if (!values.idCustomer) {
            errors.idCustomer = "Customer ID is required";
        }
        if (!values.firstName) {
            errors.firstName = "First name is required";
        }
        if (!values.lastName) {
            errors.lastName = "Last name is required";
        }
        if (!values.address) {
            errors.address = "Address is required";
        }
        if (!values.city.cityCode) {
            errors.city = "City is required";
        }
        if(!values.phone)
            {
                errors.phone = "Phone is required";
            }
        if (!values.email) {
            errors.email = "Email is required";
        } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email)) {
            errors.email = "Invalid email address";
        }
        if (!values.passwordCust) {
            errors.passwordCust = "Password is required";
        } else if (values.passwordCust.length < 4 || values.passwordCust.length > 30) {
            errors.passwordCust = "Password must be between 4 and 30 characters";
        } else if (values.passwordCust !== values.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
        return errors;
    };

    return (
        <div id="login-container">
            <form id="login-form" onSubmit={handleSubmitRegister}>
                <h1>Register</h1>
                <div className="form-columns">
                    <div className="form-group">
                        <label>Customer ID</label>
                        <input type="text" name="idCustomer" value={formUserData.idCustomer} onChange={handleChange} />
                        {formErrors.idCustomer && <p className="error">{formErrors.idCustomer}</p>}
                    </div>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" name="firstName" value={formUserData.firstName} onChange={handleChange} />
                        {formErrors.firstName && <p className="error">{formErrors.firstName}</p>}
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" name="lastName" value={formUserData.lastName} onChange={handleChange} />
                        {formErrors.lastName && <p className="error">{formErrors.lastName}</p>}
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" name="address" value={formUserData.address} onChange={handleChange} />
                        {formErrors.address && <p className="error">{formErrors.address}</p>}
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <select name="cityCode" value={formUserData.city.cityCode} onChange={handleCityChange}>
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.CityCode} value={city.CityCode}>{city.CityName}</option>
                            ))}
                        </select>
                        {formErrors.city && <p className="error">{formErrors.city}</p>}
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" name="email" value={formUserData.email} onChange={handleChange} />
                        {formErrors.email && <p className="error">{formErrors.email}</p>}
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="text" name="phone" value={formUserData.phone} onChange={handleChange} />
                        {formErrors.phone && <p className="error">{formErrors.phone}</p>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="passwordCust" value={formUserData.passwordCust} onChange={handleChange} />
                        {formErrors.passwordCust && <p className="error">{formErrors.passwordCust}</p>}
                    </div>
                    {formUserData.passwordCust && (
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formUserData.confirmPassword} onChange={handleChange} />
                            {formErrors.confirmPassword && <p className="error">{formErrors.confirmPassword}</p>}
                        </div>
                    )}
                    
                    <button type="submit">Register</button>
                    <Link to="/login" className="register-button">Login</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterCustomer;
