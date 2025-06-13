import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorProvider, useError } from './context/ErrorContext';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import News from "./pages/News";
import Register from './pages/Registration';
import CreateNews from './pages/CreateNews';
import Friends from './pages/Friends';
import UserFeed from './pages/UserFeed';
import NotFound from './pages/Errors/NotFound';
import ErrorHandler from "./components/ErrorHandler";

function AppContent() {
  const { errorCode, setErrorCode } = useError();
  const location = useLocation();

    useEffect(() => {
      if (errorCode) {
        setErrorCode(null);
      }
    }, [location.pathname]);

  if (errorCode) {
    return (
      <>
        <Header />
        <ErrorHandler />
        <Footer companyName="Friendly" />
      </>
    );
  }

  return (
    <>
      <Header />
      <ErrorHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/registration' element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news/create-news"
          element={
            <ProtectedRoute>
              <CreateNews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer companyName="Friendly" />
    </>
  );
}

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AuthProvider>
        <ErrorProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ErrorProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
