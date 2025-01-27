/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ChangePassword from "./components/ChangePassword";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import Preferences from "./components/Preferences";
import { ProfileProvider } from "./context/ProfileContext";
import CreateWave from "./components/CreateWave";
import WaveList from "./components/WaveList";
import Friends from "./components/Friends";
import WavesInfo from "./components/WavesInfo";
import AdminLogin from "./components/AdminLogin";
import AdminSignup from "./components/AdminSignup";
import InviteFriends from "./components/InviteFriends";
import UserDetails from "./components/UserDetails";
import AdminDashboard from "./components/AdminDashboard";
import AdminUserList from "./components/AdminUserList";
import AdminWaveList from "./components/AdminWavelist";
import InactiveUserList from "./components/InactiveUserList";
import ActiveUsersList from "./components/ActiveUsersList";

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");
  }, []);

  return (
    <ProfileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/adminSignup" element={<AdminSignup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/adminDashBoard" element={<AdminDashboard />} />
          <Route path="/admin-user-list" element={<AdminUserList />} />
          <Route path="/admin-wave-list" element={<AdminWaveList />} />
          <Route path="/inActive-users-list" element={<InactiveUserList />} />
          <Route path="/active-users-list" element={<ActiveUsersList />} />
          <Route
            path="/userDetails/:userId"
            element={
              <UserDetails
                user={undefined}
                onClose={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
            }
          />
          {/* Nested Routes for Dashboard */}
          <Route
            path="/user"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
            }
          >
            <Route path="" element={<WaveList />} />
            <Route
              path=""
              element={
                <WavesInfo
                  setOpenModel={function (
                    value: React.SetStateAction<boolean>
                  ): void {
                    throw new Error("Function not implemented.");
                  }}
                  waveId={null}
                  waveImage={null}
                  waveMessage={null}
                  posterIcon={null}
                  posterName={null}
                />
              }
            />
            <Route path="invitefriends" element={<InviteFriends />} />
            <Route path="profile" element={<Profile />} />
            <Route path="preferences" element={<Preferences />} />
            <Route path="friends" element={<Friends />} />
            <Route path="waves" element={<CreateWave />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ProfileProvider>
  );
};

export default App;
