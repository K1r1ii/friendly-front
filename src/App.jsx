import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const userAvatar = "emblem_logo.png";
  const user = {avatarUrl: userAvatar};

  return (
    <div className="d-flex flex-column min-vh-100">
      <BrowserRouter>
        <Header user={user}/>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer companyName='Freindly'/>
      </BrowserRouter>
    </div>
  );
}

export default App;