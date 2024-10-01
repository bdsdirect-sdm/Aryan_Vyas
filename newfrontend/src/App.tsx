import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import UpdateProfile from './components/UpdateProfile';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/updateProfile" element={<UpdateProfile />} />
                <Route path="/" element={<Signup />} />
            </Routes>
        </Router>
    );
};

export default App;
