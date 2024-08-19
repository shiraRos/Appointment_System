import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import './css/Login.css'
import Swal from 'sweetalert2';

const Login = (props) => {
    const navigate = useNavigate();
    const [formUserData, setFormUserData] = useState({
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({});


    const handleSubmitLogin = (e) => {
        e.preventDefault();
        const errors = validate(formUserData);
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            axios.post('http://localhost:8080/customers/login', formUserData)
                .then((response) => {
                    const user = response.data;
                    console.log("the user", user);
                    if (user) {
                        const userContextData = {
                            idCustomer: user.idCustomer,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            cityCode: user.cityCode,
                            cityName: user.cityName,
                            address: user.address,
                            phone: user.phone
                        };
                        console.log("userContextData ", userContextData);
                        props.updateUserContext(userContextData);
                        // alert('Login successful');
                        Swal.fire({
                            icon: 'success',
                            title: 'Login Successful',
                            text: `Welcome, ${user.firstName}!`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        navigate(`/customerMenu/${user.firstName}`);
                        // if (response.data.idCustomer) {
                        //     const { passwordCust, confirmPassword, ...userDataWithoutPassword } = response.data;
                        //     localStorage.setItem('currentUser', JSON.stringify(userDataWithoutPassword));
                        //     // localStorage.setItem('currentUser', JSON.stringify(response.data))
                        //     alert('Login successful');
                        //     navigate(`/customerMenu/${userDataWithoutPassword.firstName}`, { state: { user: userDataWithoutPassword } });
                        // }
                    } else {
                        // Clear form fields when user doesn't exist
                        setFormUserData({
                            email: '',
                            password: ''
                        });
                        alert('User doesn\'t exist');
                    }
                })
                .catch(error => {
                    // Clear form fields when login fails
                    setFormUserData({
                        email: '',
                        password: ''
                    });
                    alert('Invalid email or password');
                    console.error('Error in handleSubmit:', error);
                });
        }
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
    };

    const validate = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = "email is required!";
        }
        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 4 || values.password.length > 40) {
            errors.password = "Password must be between 4 and 30 characters";
        }
        return errors;
    };
    const handleRegister = () => {
        navigate('/registerCustomer');
    };
    return (
        <>
            <div id="login-container">
                <form id="login-form" onSubmit={handleSubmitLogin}>
                    <h1>Login</h1>
                    <div>
                        <label>Email</label>
                        <input type="text" name="email" placeholder="Email" value={formUserData.email} onChange={handleChange} />
                        <p>{formErrors.email}</p>
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Password" value={formUserData.password} onChange={handleChange} />
                        <p>{formErrors.password}</p>
                    </div>
                    <div>
                        <button type="submit">Login</button>
                        <button type="button" onClick={handleRegister} id="register-button">Register</button>
                        <br></br>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Login;