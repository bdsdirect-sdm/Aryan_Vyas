
import './App.css'

import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import Profile from "./components/Profile"
import Chat from './components/Chat'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="chat/:chatRoomId" element={<Chat />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
