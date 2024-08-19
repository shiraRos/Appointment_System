import React from 'react'
import { useLocation, useNavigate, Outlet, json } from 'react-router-dom'
// import './style.css';

const Home = () => {

    const { state } = useLocation();
    const firstName = JSON.parse(localStorage.getItem("currentUser")).firstName;
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    //פונקצית ניתוב של כל המידע
    const handleNavigation = (path) => {
        navigate(path, { state: { user: state.user } });
    };
    return <>
        <h1>Hi, {firstName}</h1>
        <div className='allButtons'>
            <button onClick={() => handleNavigation('info')}>Info</button>
            <button onClick={() => handleNavigation('todos')}>Todos</button>
            <button onClick={() => handleNavigation('posts')}>Posts</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
        <Outlet />
    </>
}
export default Home