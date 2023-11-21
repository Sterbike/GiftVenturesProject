import React, { Fragment, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [email, setEmail] = useState("");
    
    const navigate = useNavigate();
    async function gotoLogin(){
        navigate("/")
    }

    async function submit(e) {
        e.preventDefault();
        if (password !== passwordRepeat) {
            alert("A jelszavak nem egyeznek!");
            return;
          }
        else{
            try {
                const response = await axios.post("http://localhost:3500/register", {
                    username,
                    password,  
                    email,
                });
    
                if (response.data === "username exists") {
                    alert("Felhasználónév már létezik");
                }
                else if(response.data === "email exists"){
                    alert("Ezzel az Emaillel már létezik felhasználó")
                }
                else {
                    navigate('/');
                }
            } catch (e) {
                console.log(e);
                alert("An error occurred");
            }
          }
        }


    
  return (
    <div className='login-register-container'>
        <div class="form-register-container">
            <p class="title">Regisztráció!</p>
            <form class="form-register">
               
                <input type="text" class="input" placeholder="Felhasználónév" onChange={(e) => { setUsername(e.target.value)} }/>
                <input type="email" class="input" placeholder="Email" onChange={(e) => { setEmail(e.target.value)} }/>
                <input type="password" class="input" placeholder="Jelszó" onChange={(e) => { setPassword(e.target.value)} }/>
                <input type="password" class="input" placeholder="Jelszó újra" onChange={(e) => { setPasswordRepeat(e.target.value)} }/>
                <button class="form-btn" onClick={submit}>Regisztráció</button>
            </form>
            <p class="sign-up-label">
                Van már fiókod?<span class="sign-up-link" onClick={gotoLogin}>Jelentkezz be!</span>
            </p>  
            </div>
    </div>
  )
}

export default Register