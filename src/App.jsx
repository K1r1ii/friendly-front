import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

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

function App() {
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
              path="/profile"
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
          </Routes>
          <Footer companyName='Friendly'/>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;