import React, { Fragment, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');

    
    async function goToRegister(){
        navigate("/register")
    }

    async function submit(e) {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3500/login', { emailOrUsername, password });
            if (response.status === 200) {
                localStorage.setItem('isLoggedIn', 'true')
                localStorage.setItem('userData', JSON.stringify(response.data.user));
                navigate("/userprofile");
                window.location.reload(false);
            } else {
                alert("An error occurred");
            }
        } catch (e) {
            console.log(e)
            if (e.response.status === 401) {
                alert("Incorrect password");
            } else if (e.response.status === 404) {
                alert("User not found");
            } else {
                alert("An error occured");
            }
        }
    }
  return (
    <div className='login-register-container'>
         <div class="form-container">
            <p class="title">Bejelentkezés</p>
            <form class="form-login">
                <input type="email" class="input" placeholder="Email cím vagy felhasználónév" onChange={(e) => {setEmailOrUsername(e.target.value)}}/>
                <input type="password" class="input" placeholder="Jelszó" onChange={(e) => {setPassword(e.target.value)}}/>
                <p class="page-link">
                <span class="page-link-label">Elfelejtett jelszó?</span>
                </p>
                <button class="form-btn" onClick={submit}>Bejelentkezés</button>
            </form>
            <p class="sign-up-label">
                Nincs fiókod?<span class="sign-up-link" onClick={goToRegister}>Regisztrálj!</span>
            </p>
        </div>
    </div>
  )
}

export default Login