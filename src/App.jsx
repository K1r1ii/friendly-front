import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Dashboard from "./pages/Dashboard";
import { useState } from 'react';

function App() {
  // const userAvatar = "emblem_logo.png";
  const userData = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">
      <AuthProvider >
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/profile/get_information"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

             <Route
               path="/profile/edit"
               element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
             />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer companyName='Freindly'/>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;