/* eslint-disable no-unused-vars */
import React from 'react'
import { BrowserRouter, Routes ,Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import UpdateProfile from './pages/UpdateProfile'
const App = () => {
  return (
 <BrowserRouter>
  <Routes>
    <Route path="/" element={<Signup/>}></Route>
    <Route path="/profile/:id" element={<Profile/>}></Route>
    <Route path="/update-profile/:id" element={<UpdateProfile/>}></Route>
  </Routes>
 </BrowserRouter>
  );
}

export default App
