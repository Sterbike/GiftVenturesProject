import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import UserProfile from './pages/UserProfile/UserProfile';
import Navbar from './components/Navbar/Navbar';
import SignoutConfirm from './components/SignoutConfirm/SignoutConfirm';
import Upload from './pages/Upload/Upload';
import Main from './pages/Main/Main';
import ImagePage from './pages/ImagePage/ImagePage';
import { useState, useEffect } from 'react';


function App() {
  
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  

  return (
    <div id='App' className="App">
      <Router>
        {isLoggedIn ? (
          <Navbar/>
        ) : (
            null
        )}
          <Routes>
              <Route path='/' element={<Login />} /> 
              <Route path='/register' element={<Register />} />
              <Route path='/userprofile' element={<UserProfile />}/>
              <Route path='/signoutconfirm' element={<SignoutConfirm/>}/>
              <Route path='/upload' element={<Upload/>}/>
              <Route path='/main' element={<Main/>}/>
              <Route path='/ImagePage/:imageId' element={<ImagePage/>}/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
