import React, { useContext } from 'react';
import { UserContext } from '../App';
import { useNavigate, Outlet } from 'react-router-dom';
import icon from '../image/logo.png';
import '../css/customerMenu.css';

const CustomerMenu = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  // const location = useLocation();
  // // const { user } = location.state || {}; // Get user from state
  // // console.log(user);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return <>
    <div className='sticky-menu'>
      <img src={icon} alt="User Icon" className="user-icon" />
      <h2>Hi, {user ? user.firstName : 'Guest'}</h2>
      {/* <nav> */}
      <button className="btn" onClick={() => navigate('myProfile')}>My Profile</button>
      <button className="btn" onClick={() => navigate('inviteQueue')}>Invite Queue</button>
      <button className="btn" onClick={() => navigate('myMessages')}>My Messages</button>
      <button className="btn" onClick={() => navigate('myQueues')}>My Queues</button>
      <button className="btn" onClick={() => navigate('searchBusinessOwner')}>Search for Professional</button>
      <button className="btn" onClick={handleLogout}>Logout</button>
      {/* </nav> */}
    </div>
    <Outlet />
  </>
}

export default CustomerMenu;
