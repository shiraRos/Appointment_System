import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { createContext } from 'react';
import Login from './Login';
import CustomerMenu from './customer/customerMenu';
import RegisterCustomer from './customer/RegisterCustomer';
import LandingPage from './LandingPage';
import SearchBusinessOwner from './customer/SearchBusinessOwner';
import MyQueues from './customer/MyQueues';
import MyProfile from './customer/MyProfile';
import MyMessages from './customer/MyMessages';
import InviteQueue from './customer/InviteQueue';
import InviteDate from './customer/InviteDate';
import useLocalStorage from './useLocalStorage';
import './style.css';
export const UserContext = createContext();

function App() {
  const [user, setUser, claerLocalStorage] = useLocalStorage('user', null);

  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem('currentUser'));
  //   setUser(storedUser);
  // }, []);

  return (
    <BrowserRouter>
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/landingPage" element={<LandingPage />} />
          <Route path="/login" element={<Login updateUserContext={setUser} />} />
          <Route path="/registerCustomer" element={<RegisterCustomer updateUserContext={setUser} />} />
          <Route path="/customerMenu/:userid" element={<CustomerMenu />}>
            <Route path="myProfile" element={<MyProfile />} />
            <Route path="searchBusinessOwner" element={<SearchBusinessOwner />} />
            <Route path="myQueues" element={<MyQueues />} />
            <Route path="myMessages" element={<MyMessages />} />
            <Route path="inviteQueue" element={<InviteQueue />} />
            <Route path="inviteDate" element={<InviteDate />} />
          </Route>
          <Route path="*" element={<Navigate to="/landingPage" />} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;


{/* <Route path="/Menu" element={<CustomerMenu />}> */ }
{/* <Route index element={<MyQueues />} /> */ }
{/* <Route path="profile" element={<Profile />} /> */ }
{/* <Route path="invite-queue" element={<InviteQueue />} /> */ }
{/* <Route path="messages" element={<Messages />} /> */ }
{/* <Route path="/my-queues" element={<MyQueues />} /> */ }
{/* <Route path="/search-business-owner" element={<SearchBusinessOwner />} /> */ }
{/* </Route> */ }