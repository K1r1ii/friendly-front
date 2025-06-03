import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from "./pages/Login";
import { useState } from 'react';
import Register from './pages/Registration';

function App() {
  const userData = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">
      <AuthProvider >
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path='/registration' element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
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