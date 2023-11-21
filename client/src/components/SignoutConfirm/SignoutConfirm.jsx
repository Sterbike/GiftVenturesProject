import React from 'react'
import { useNavigate } from 'react-router-dom';

const SignoutConfirm = () => {
    const navigate = useNavigate();

    async function Signout(){
        localStorage.removeItem("isLoggedIn")
        navigate("/")
    }

    async function Cancel(){
        navigate(-1)
    }

  return (
    <div className='signout-container'>
        <h1>Biztos ki szeretne jelentkezni?</h1>
        <button onClick={Signout}>Igen</button>
        <button onClick={Cancel}>Nem</button>

    </div>
  )
}

export default SignoutConfirm