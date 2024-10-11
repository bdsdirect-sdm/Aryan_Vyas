import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import RegisterForm from './components/RegisterForm';
import UserProfile from './components/Userprofile';
import JobSeekersList from './components/JobSeekerslist';
import PasswordReset from "./components/PasswordReset";

const App = () => {
    const token = localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                <Route path="/" element={<RegisterForm />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={token ? <UserProfile/> : <Navigate to="/login" />} />
                <Route path="/job-seekers" element={token ? <JobSeekersList  /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
